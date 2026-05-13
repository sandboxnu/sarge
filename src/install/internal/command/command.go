package command

import (
	_ "embed"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"text/template"

	"strings"
)

//go:embed templates/docker-compose.yml
var compose []byte

//go:embed templates/Caddyfile.tmpl
var caddyfileTmpl string

type CaddyConfig struct {
	Hostname string
}

var (
	detectedOS   string
	detectedArch string
)

// Using pipes and other shell specific features requires a function like this as it is not supported
// in exec.Command() directly
func runShellCommand(cmd string) error {
	return exec.Command("bash", "-c", cmd).Run()
}

func CheckSystemRequirements() error {
	output, err := exec.Command("uname", "-s").Output()
	if err != nil {
		return errors.New("unable to run command: 'uname -s'")
	}
	detectedOS = strings.TrimSpace(string(output))
	if detectedOS != "Linux" && detectedOS != "Darwin" && detectedOS != "FreeBSD" {
		return fmt.Errorf("unsupported OS: %s", detectedOS)
	}

	output, err = exec.Command("uname", "-m").Output()
	if err != nil {
		return errors.New("unable to run command: 'uname -m'")
	}
	arch := strings.TrimSpace(string(output))
	switch arch {
	case "x86_64":
		detectedArch = "amd64"
	case "aarch64", "arm64":
		detectedArch = "arm64"
	default:
		return fmt.Errorf("unsupported architecture: %s", arch)
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
	err := ensureGit()
	if err != nil {
		return err
	}

	err = ensureDocker()
	if err != nil {
		return err
	}

	err = ensureCaddy()
	if err != nil {
		return err
	}

	return nil
}

func ensureDocker() error {
	if exec.Command("docker", "info").Run() == nil {
		return nil
	}

	if exec.Command("which", "docker").Run() == nil {
		return errors.New("Docker is installed but not running, please start your Docker service")
	}

	return runShellCommand("curl -fsSL https://get.docker.com | sh")
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
		strings.ToLower(detectedOS), detectedArch,
	)
	return runShellCommand(fmt.Sprintf(
		"curl -fsSL '%s' -o /usr/local/bin/caddy && chmod +x /usr/local/bin/caddy", installUrl,
	))
}

func BootstrapCaddy(hostname string) error {
	t, err := template.New("caddyfile").Parse(caddyfileTmpl)
	if err != nil {
		return err
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
