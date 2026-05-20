#!/bin/sh
set -eu

INSTALL_DIR='/usr/local/bin'
DOWNLOAD_BASE='https://github.com/sandboxnu/sarge/releases/latest/download'
BINARY_NAME='sarge'
SARGE_BIN=''
DOWNLOADER=''

main() {
  os=$(detect_os)
  arch=$(detect_arch)
  ensure_root
  ensure_downloader
  download_sarge_installer "$os" "$arch"
  run_installer
}

detect_os() {
  case "$(uname -s)" in
  Linux*) echo "linux" ;;
  Darwin*) echo "darwin" ;;
  *)
    echo "Unsupported OS: $(uname -s)" >&2
    exit 1
    ;;
  esac
}

detect_arch() {
  case "$(uname -m)" in
  x86_64) echo "amd64" ;;
  aarch64) echo "arm64" ;;
  arm64) echo "arm64" ;;
  *)
    echo "Unsupported architecture: $(uname -m)" >&2
    exit 1
    ;;
  esac
}

ensure_root() {
  if [ "$(id -u)" -ne 0 ]; then
    echo "sarge install must be run as root" >&2
    exit 1
  fi
}

ensure_downloader() {
  if command -v curl >/dev/null 2>&1; then
    DOWNLOADER=curl
    return
  fi
  if command -v wget >/dev/null 2>&1; then
    DOWNLOADER=wget
    return
  fi
  echo "curl or wget is required to install sarge" >&2
  exit 1
}

download() {
  url="$1"
  output="$2"

  case "$DOWNLOADER" in
  curl) curl -fsSL -o "$output" "$url" ;;
  wget) wget -q -O "$output" "$url" ;;
  esac
}

download_sarge_installer() {
  os="$1"
  arch="$2"

  if command -v "$BINARY_NAME" >/dev/null 2>&1; then
    SARGE_BIN=$(command -v "$BINARY_NAME")
    echo "${BINARY_NAME} is already installed at ${SARGE_BIN}"
    return
  fi

  echo "Downloading ${BINARY_NAME} for ${os}/${arch}..."
  asset="${BINARY_NAME}-${os}-${arch}"
  tmpfile=$(mktemp)
  download "${DOWNLOAD_BASE}/${asset}" "$tmpfile"

  install -m 755 "$tmpfile" "${INSTALL_DIR}/${BINARY_NAME}"
  rm -f "$tmpfile"

  SARGE_BIN="${INSTALL_DIR}/${BINARY_NAME}"
  echo "Installed ${BINARY_NAME} to ${SARGE_BIN}"
}

run_installer() {
  exec "${SARGE_BIN}" </dev/tty
}

main
