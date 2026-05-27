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

//go:embed templates/env.tmpl
var envTmpl string

type CaddyConfig struct {
	Hostname string
}

type envConfig struct {
	DBPassword       string
	BetterAuthSecret string
	Hostname         string
	JWTSecret        string
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
		return err
	}
	if err := ensureDocker(); err != nil {
		return fmt.Errorf("installing docker: %w", err)
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
		return errors.New("docker is installed but not running, please start your Docker service")
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

const (
	sargeRoot       = "/opt/sarge"
	composeFileName = "docker-compose.yaml"
	envFileName     = ".env"
	caddyfileName   = "Caddyfile"
)

func BootstrapSarge(hostname string) error {
	if err := os.MkdirAll(sargeRoot, 0755); err != nil {
		return fmt.Errorf("creating %s: %w", sargeRoot, err)
	}
	if err := writeComposeFile(); err != nil {
		return fmt.Errorf("writing %s: %w", composeFileName, err)
	}
	if err := writeCaddyfile(hostname); err != nil {
		return fmt.Errorf("writing %s: %w", caddyfileName, err)
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

func writeCaddyfile(hostname string) error {
	t, err := template.New("caddyfile").Parse(caddyfileTmpl)
	if err != nil {
		return err
	}
	var buf bytes.Buffer
	if err := t.Execute(&buf, CaddyConfig{Hostname: hostname}); err != nil {
		return err
	}
	return os.WriteFile(sargeRoot+"/"+caddyfileName, buf.Bytes(), 0644)
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

	t, err := template.New("env").Parse(envTmpl)
	if err != nil {
		return err
	}
	var buf bytes.Buffer
	if err := t.Execute(&buf, envConfig{
		DBPassword:       dbPassword,
		BetterAuthSecret: betterAuthSecret,
		Hostname:         hostname,
		JWTSecret:        jwtSecret,
	}); err != nil {
		return err
	}
	return os.WriteFile(envPath, buf.Bytes(), 0600)
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
	// NOTE(laith): this tells exec.Cmd which directory to run the command in
	cmd.Dir = sargeRoot
	return runCmd(cmd)
}
