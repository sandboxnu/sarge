package command

import (
	"bytes"
	"crypto/rand"
	_ "embed"
	"encoding/hex"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"runtime"
	"strings"
	"text/template"
)

//go:embed templates/docker-compose.yml
var compose []byte

//go:embed templates/Caddyfile.tmpl
var caddyfileTmpl string

type CaddyConfig struct {
	Hostname string
}

var installCli string

func runCmd(cmd *exec.Cmd) error {
	var stderrBuf bytes.Buffer
	cmd.Stderr = &stderrBuf
	if err := cmd.Run(); err != nil {
		msg := strings.TrimSpace(stderrBuf.String())
		if msg == "" {
			return err
		}
		return fmt.Errorf("%w: %s", err, msg)
	}
	return nil
}

func runShellCommand(cmd string) error {
	return runCmd(exec.Command("bash", "-c", cmd))
}

func CheckSystemRequirements() error {
	if runtime.GOOS != "linux" {
		return fmt.Errorf("unsupported OS: %s (sarge currently only supports linux)", runtime.GOOS)
	}
	switch runtime.GOARCH {
	case "amd64", "arm64":
	default:
		return fmt.Errorf("unsupported architecture: %s", runtime.GOARCH)
	}
	return nil
}

func CheckPermission() error {
	if uid := os.Getuid(); uid != 0 {
		return fmt.Errorf("user is not root (current uid: %d)", uid)
	}
	return nil
}

func InstallDependencies() error {
	if err := ensureCurlOrWget(); err != nil {
		return fmt.Errorf("%w", err)
	}
	if err := ensureDocker(); err != nil {
		return fmt.Errorf("installing docker: %w", err)
	}
	if err := ensureCaddy(); err != nil {
		return fmt.Errorf("installing caddy: %w", err)
	}
	return nil
}

func ensureCurlOrWget() error {
	if exec.Command("which", "curl").Run() == nil {
		installCli = "curl"
		return nil
	}

	if exec.Command("which", "wget").Run() == nil {
		installCli = "wget"
		return nil
	}

	return errors.New("wget or curl is required to install Sarge")
}

func ensureDocker() error {
	if exec.Command("docker", "info").Run() == nil {
		return nil
	}

	if exec.Command("which", "docker").Run() == nil {
		return errors.New("Docker is installed but not running, please start your Docker service")
	}

	var fetch string
	switch installCli {
	case "curl":
		fetch = "curl -fsSL https://get.docker.com"
	case "wget":
		fetch = "wget -qO- https://get.docker.com"
	default:
		return fmt.Errorf("unknown downloader: %s", installCli)
	}
	return runShellCommand(fetch + " | sh")
}

func ensureCaddy() error {
	if exec.Command("which", "caddy").Run() != nil {
		if err := downloadCaddy(); err != nil {
			return err
		}
	}

	if err := ensureCaddyUser(); err != nil {
		return fmt.Errorf("creating caddy user: %w", err)
	}
	if err := installCaddySystemdUnit(); err != nil {
		return fmt.Errorf("installing caddy systemd unit: %w", err)
	}
	return nil
}

func downloadCaddy() error {
	installUrl := fmt.Sprintf(
		"https://caddyserver.com/api/download?os=linux&arch=%s",
		runtime.GOARCH,
	)

	tmp, err := os.CreateTemp("", "caddy-*")
	if err != nil {
		return fmt.Errorf("creating temp file: %w", err)
	}
	tmpPath := tmp.Name()
	tmp.Close()
	defer os.Remove(tmpPath)

	var downloadCmd string
	switch installCli {
	case "curl":
		downloadCmd = fmt.Sprintf("curl -fsSL -o %s %q", tmpPath, installUrl)
	case "wget":
		downloadCmd = fmt.Sprintf("wget -q -O %s %q", tmpPath, installUrl)
	default:
		return fmt.Errorf("unknown downloader: %s", installCli)
	}

	if err := runShellCommand(downloadCmd); err != nil {
		return fmt.Errorf("downloading caddy: %w", err)
	}
	return runCmd(exec.Command("install", "-m", "755", tmpPath, "/usr/local/bin/caddy"))
}

const caddyUnitPath = "/etc/systemd/system/caddy.service"

const caddySystemdUnit = `[Unit]
Description=Caddy
Documentation=https://caddyserver.com/docs/
After=network.target network-online.target
Requires=network-online.target

[Service]
Type=notify
User=caddy
Group=caddy
ExecStart=/usr/local/bin/caddy run --environ --config /etc/caddy/Caddyfile
ExecReload=/usr/local/bin/caddy reload --config /etc/caddy/Caddyfile --force
TimeoutStopSec=5s
LimitNOFILE=1048576
PrivateTmp=true
ProtectSystem=full
AmbientCapabilities=CAP_NET_BIND_SERVICE

[Install]
WantedBy=multi-user.target
`

func ensureCaddyUser() error {
	if exec.Command("id", "caddy").Run() == nil {
		return nil
	}
	return runCmd(exec.Command(
		"useradd", "--system",
		"--home", "/var/lib/caddy", "--create-home",
		"--shell", "/usr/sbin/nologin",
		"caddy",
	))
}

func installCaddySystemdUnit() error {
	if err := os.WriteFile(caddyUnitPath, []byte(caddySystemdUnit), 0644); err != nil {
		return err
	}
	if err := runCmd(exec.Command("systemctl", "daemon-reload")); err != nil {
		return err
	}
	return runCmd(exec.Command("systemctl", "enable", "caddy"))
}

func BootstrapCaddy(hostname string) error {
	t, err := template.New("caddyfile").Parse(caddyfileTmpl)
	if err != nil {
		return err
	}

	if err := os.MkdirAll("/etc/caddy", 0755); err != nil {
		return fmt.Errorf("creating /etc/caddy: %w", err)
	}

	var buf bytes.Buffer
	if err := t.Execute(&buf, CaddyConfig{Hostname: hostname}); err != nil {
		return err
	}
	if err := os.WriteFile("/etc/caddy/Caddyfile", buf.Bytes(), 0644); err != nil {
		return err
	}

	return runCmd(exec.Command("systemctl", "reload-or-restart", "caddy"))
}

const (
	sargeRoot       = "/opt/sarge"
	composeFileName = "docker-compose.yaml"
	envFileName     = ".env"
)

func BootstrapSarge(hostname string) error {
	if err := os.MkdirAll(sargeRoot, 0755); err != nil {
		return fmt.Errorf("creating %s: %w", sargeRoot, err)
	}
	if err := writeComposeFile(); err != nil {
		return fmt.Errorf("writing %s: %w", composeFileName, err)
	}
	if err := writeEnvFile(hostname); err != nil {
		return fmt.Errorf("writing %s: %w", envFileName, err)
	}
	if err := startSarge(); err != nil {
		return fmt.Errorf("starting sarge: %w", err)
	}
	return nil
}

func writeComposeFile() error {
	return os.WriteFile(sargeRoot+"/"+composeFileName, compose, 0644)
}

func writeEnvFile(hostname string) error {
	envPath := sargeRoot + "/" + envFileName
	if _, err := os.Stat(envPath); err == nil {
		return nil
	}

	dbPassword, err := randomHex(24)
	if err != nil {
		return fmt.Errorf("generating DB_PASSWORD: %w", err)
	}
	betterAuthSecret, err := randomHex(32)
	if err != nil {
		return fmt.Errorf("generating BETTER_AUTH_SECRET: %w", err)
	}
	jwtSecret, err := randomHex(32)
	if err != nil {
		return fmt.Errorf("generating JWT_SECRET: %w", err)
	}

	contents := fmt.Sprintf(`DB_USER=sarge
DB_PASSWORD=%s
DB_NAME=sarge

BETTER_AUTH_SECRET=%s
BETTER_AUTH_URL=https://%s
JWT_SECRET=%s

# Fill these in to enable file uploads, email, and code execution.
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_SECRET_NAME=
AWS_BUCKET_NAME=
EMAIL_DOMAIN=
JUDGE_API_KEY=
JUDGE_URL=
NEXT_PUBLIC_CDN_BASE=
`, dbPassword, betterAuthSecret, hostname, jwtSecret)

	return os.WriteFile(envPath, []byte(contents), 0600)
}

func randomHex(n int) (string, error) {
	b := make([]byte, n)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

func startSarge() error {
	cmd := exec.Command("docker", "compose", "up", "-d")
	cmd.Dir = sargeRoot
	return runCmd(cmd)
}
