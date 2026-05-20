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
	switch runtime.GOOS {
	case "linux", "darwin", "freebsd":
	default:
		return fmt.Errorf("unsupported OS: %s", runtime.GOOS)
	}
	switch runtime.GOARCH {
	case "amd64", "arm64":
	default:
		return fmt.Errorf("unsupported architecture: %s", runtime.GOARCH)
	}
	return nil
}

func CheckPermission() error {
	output, err := exec.Command("id", "-u").Output()
	if err != nil {
		return errors.New("Unable to run command: 'id -u'")
	}

	uid := strings.TrimSpace(string(output))

	if uid != "0" {
		return errors.New("User is not root: $(id -u)")
	}
	return nil
}

func InstallDependencies() error {
	if err := ensureCurlOrWget(); err != nil {
		return fmt.Errorf("%w", err)
	}
	if err := ensureGit(); err != nil {
		return fmt.Errorf("installing git: %w", err)
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

	return runShellCommand(installCli + " https://get.docker.com | sh")
}

func ensureGit() error {
	if exec.Command("which", "git").Run() == nil {
		return nil
	}
	return errors.New("git is required but not installed")
}

func ensureCaddy() error {
	if exec.Command("which", "caddy").Run() == nil {
		return nil
	}

	installUrl := fmt.Sprintf(
		"https://caddyserver.com/api/download?os=%s&arch=%s",
		runtime.GOOS, runtime.GOARCH,
	)
	return runShellCommand(fmt.Sprintf(
		"%s %s > /usr/local/bin/caddy && chmod +x /usr/local/bin/caddy",
		installCli, installUrl,
	))
}

func BootstrapCaddy(hostname string) error {
	t, err := template.New("caddyfile").Parse(caddyfileTmpl)
	if err != nil {
		return err
	}

	if err := os.MkdirAll("/etc/caddy", 0755); err != nil {
		return fmt.Errorf("creating /etc/caddy: %w", err)
	}

	f, err := os.Create("/etc/caddy/Caddyfile")
	if err != nil {
		return err
	}

	defer f.Close()

	return t.Execute(f, CaddyConfig{
		Hostname: hostname,
	})
}

const (
	sargeRepoURL    = "https://github.com/sandboxnu/sarge"
	sargeRepoPath   = "/opt/sarge"
	composeFileName = "docker-compose.yaml"
	envFileName     = ".env"
)

func BootstrapSarge() error {
	if err := cloneSarge(); err != nil {
		return fmt.Errorf("cloning sarge: %w", err)
	}
	if err := writeComposeFile(); err != nil {
		return fmt.Errorf("writing %s: %w", composeFileName, err)
	}
	if err := writeEnvFile(); err != nil {
		return fmt.Errorf("writing %s: %w", envFileName, err)
	}
	if err := startSarge(); err != nil {
		return fmt.Errorf("starting sarge: %w", err)
	}
	return nil
}

func cloneSarge() error {
	if _, err := os.Stat(sargeRepoPath); err == nil {
		return nil
	}
	return runCmd(exec.Command("git", "clone", sargeRepoURL, sargeRepoPath))
}

func writeComposeFile() error {
	return os.WriteFile(sargeRepoPath+"/"+composeFileName, compose, 0644)
}

func writeEnvFile() error {
	envPath := sargeRepoPath + "/" + envFileName
	if _, err := os.Stat(envPath); err == nil {
		return nil
	}

	pw := make([]byte, 24)
	if _, err := rand.Read(pw); err != nil {
		return err
	}

	contents := fmt.Sprintf("DB_USER=sarge\nDB_PASSWORD=%s\nDB_NAME=sarge\n", hex.EncodeToString(pw))
	return os.WriteFile(envPath, []byte(contents), 0600)
}

func startSarge() error {
	cmd := exec.Command("docker", "compose", "up", "-d")
	cmd.Dir = sargeRepoPath
	return runCmd(cmd)
}
