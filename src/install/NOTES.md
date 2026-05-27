# Install script — working notes

Running notes while filling in the gaps required to make `install.sh` actually
bring a fresh VPS up. Each entry is dated; newest at the top.

## 2026-05-26 — Caddy startup

### Problem

`ensureCaddy()` downloaded the binary to `/usr/local/bin/caddy` and
`BootstrapCaddy()` wrote `/etc/caddy/Caddyfile`, but nothing ever started
Caddy. The installer would happily report success while port 443 was closed.

### Fix

Install the official-style systemd unit at `/etc/systemd/system/caddy.service`
during the dependency step, then `systemctl reload-or-restart caddy` after the
Caddyfile is written in the hostname step.

### Decisions / why

- **System user, not root.** Caddy ships its recommended unit assuming a
  dedicated `caddy` system user with home at `/var/lib/caddy` (where it stashes
  ACME state and certs). We create it with `useradd --system` if missing — the
  `id caddy` precheck keeps re-runs idempotent.
- **`AmbientCapabilities=CAP_NET_BIND_SERVICE`** so the unprivileged caddy user
  can bind 80/443.
- **`ExecStart` points at `/usr/local/bin/caddy`** (not `/usr/bin/caddy` as in
  the upstream unit) because that's where `ensureCaddy` installs it. If we ever
  switch to apt/dnf packages, this needs to flip.
- **`reload-or-restart`** instead of plain `restart`: on a re-run with the same
  hostname we just want a hot reload; on first boot or hostname change a full
  start is required. `reload-or-restart` does the right thing in both cases.
- **Caddyfile write went through `bytes.Buffer` + `os.WriteFile`** so the file
  is fully flushed and closed before we ask systemd to reload it. The previous
  `os.Create` + `defer Close` had the Close run _after_ the systemctl call.

### Known limitations / follow-ups

- If caddy is already installed via apt (so `which caddy` succeeds and we skip
  the download branch), we won't install our unit. The distro's unit will be
  present in that case and `reload-or-restart` should still work, but the
  `ExecStart` path may differ — worth re-checking if anyone reports it.
- Doesn't open the firewall. `ufw allow 80,443/tcp` is still a separate TODO.
- Doesn't verify DNS resolves to this host before kicking off ACME, so a
  misconfigured A record will manifest as a Caddy log error rather than a
  pre-flight failure.

## 2026-05-26 — Correctness nits

### `CheckPermission`

Was shelling out to `id -u`, parsing the output, and on failure returning the
literal string `"User is not root: $(id -u)"` — no shell to interpolate, so
users would just see the dollar-sign expansion verbatim. Replaced with
`os.Getuid()`. No subprocess, no string parsing, and the error message
actually includes the uid via `%d`.

### Caddy download

The original `curl <url> > /usr/local/bin/caddy && chmod +x` had two bugs:

1. **No `-L`.** Caddy's download endpoint 302-redirects to a CDN. Without
   follow-redirects, curl just wrote a tiny redirect-body to the target
   path. `chmod +x` then made it look installed. systemd would fail to
   start it later with a confusing exec error.
2. **Half-write risk.** Any mid-stream failure left a partial file at
   `/usr/local/bin/caddy`. The next install run would see `which caddy`
   succeed and skip re-download — leaving the broken binary in place.

Fix: download to a temp file with proper flags (curl `-fsSL`, wget `-q`),
then atomic move with `install -m 755`. Mirrors the pattern `install.sh`
already uses for the sarge binary. Factored into a `downloadCaddy` helper
so `ensureCaddy` reads as intent rather than shell incantation.

### Docker install (same flag bugs)

Same shape as the Caddy fix. `ensureDocker` built `curl https://get.docker.com | sh`
or `wget https://get.docker.com | sh`. Both wrong:

- curl needed `-fsSL` (otherwise pipes redirect HTML or error bodies to sh).
- wget needed `-qO-` to write to stdout (the default is a file, so the wget
  branch was a no-op).

Replaced with a small `switch installCli` that picks the right flags and pipes
into `sh`. Matches Docker's own documented install command.

## 2026-05-26 — Self-host WS default

### Problem

`useHeartbeat.ts` read `NEXT_PUBLIC_WS_URL` (inlined at build time) and fell
back to `ws://localhost:8080`. The image we ship to GHCR has no value baked
in, so self-hosters would have their browser try to reach their own laptop's
localhost. Live candidate monitoring broken out of the box.

### Fix

One-line behavior change in `src/lib/hooks/useHeartbeat.ts`: the fallback now
derives WS URL from the current page's hostname, matching the Caddyfile's
`ws.<hostname>` subdomain proxy:

```
const WS_URL =
    process.env.NEXT_PUBLIC_WS_URL ??
    (typeof window !== 'undefined'
        ? `wss://ws.${window.location.hostname}`
        : 'ws://localhost:8080');
```

### Decisions / why

- **Env var still wins.** Anyone who's been setting `NEXT_PUBLIC_WS_URL`
  explicitly (the hosted prod deploy) is unaffected — the `??` chain
  preserves precedence.
- **`typeof window` guard.** The caller is a `'use client'` page, but React
  still evaluates the module top-level during SSR for initial HTML.
  Without the guard, `window.location.hostname` throws server-side.
- **`localhost:8080` retained as the SSR-side fallback.** It's the wrong
  URL for self-host browsers, but it doesn't matter — `useWebSocket` only
  opens the connection in an effect, which never runs server-side. The
  client-side render after hydration uses the real `window` branch.
- **`wss://` (not `ws://`).** Caddy terminates TLS at the edge for the
  self-host install, so the upstream connection is always over secure WS.

## 2026-05-26 — Dropped goreleaser

### Decision

goreleaser was overkill for one Go binary on one OS with two arches. The
config (`.goreleaser.yaml`) and the `goreleaser/goreleaser-action` step are
both gone. `release.yml`'s `release` job now uses plain `actions/setup-go`

- a 3-line loop:

```
for arch in amd64 arm64; do
  GOARCH=$arch go build -ldflags="-s -w" -o sarge-linux-$arch .
done
```

…followed by `gh release create <tag> sarge-linux-* --generate-notes`. The
artifact names (`sarge-linux-amd64`, `sarge-linux-arm64`) are unchanged, so
`install.sh` keeps working.

### Things we gave up (and why it's fine)

- **Auto-generated `checksums.txt`.** One `shasum -a 256` away if anyone
  asks. Not worth the tool dependency for a binary that's downloaded over
  HTTPS from GitHub releases anyway.
- **Snapshot/dev versioning.** We weren't using it.
- **`prerelease: auto`.** `gh release create` ships releases as
  non-prerelease by default; if we ever want auto-prerelease on `v*-rc.*`
  tags, it's a 2-line shell check.

### Other cleanups

- Removed `/dist` from `.gitignore` — was only there for goreleaser's local
  output dir.
- Re-tagging the same `v*` now fails because `gh release create` won't
  overwrite an existing release. That's a feature, not a bug; if you really
  need to re-cut, delete the release first.

## 2026-05-26 — Prebuilt images via GHCR

### Problem

The install compose template told docker to `build: context: .`, which ran
`pnpm install && next build` on the VPS. On a 1GB droplet that OOM-kills.
Even on a 2GB box it's a 5–10 minute install where the user just sees a
spinner. It also forced a `git clone` step and a `git` dependency just so the
Dockerfile would be present.

### Fix

1. `release.yml` now runs a second job (`publish-images`) on `v*` tags that
   builds and pushes two images to GHCR:
    - `ghcr.io/sandboxnu/sarge-web` ← root `Dockerfile`
    - `ghcr.io/sandboxnu/sarge-ws` ← `src/ws/Dockerfile`
      Both get tagged `:vX.Y.Z` and `:latest`.
2. The install compose template now uses `image:` instead of `build:` for
   web and ws, with `pull_policy: always` so `docker compose up -d` pulls the
   newest `:latest` every time (this is the foundation for the daily
   auto-update cron we owe the user).
3. `cloneSarge` is gone. `BootstrapSarge` now just `mkdir -p /opt/sarge` and
   drops the compose file + `.env` in there. The `git` dependency is dropped
   from `InstallDependencies` since nothing else needs it. `sargeRepoURL`
   gone, `sargeRepoPath` renamed to `sargeRoot` (it's no longer a repo).

### Decisions / why

- **GHCR, not Docker Hub.** Same project, free for public images, no rate
  limits for authenticated pulls, and we already have `GITHUB_TOKEN` in CI.
- **amd64 only for now.** Multi-arch via QEMU roughly doubles release build
  time. amd64 covers ~95% of cheap VPSes. arm64 is a follow-up.
- **`:latest` consumed by the installer.** Auto-updates can then be a
  one-liner cron. The downside is that a bad release immediately breaks every
  self-hosted install on its next pull — when we add the cron we should also
  add a "pin to a specific tag" admin option.
- **Permissions: `packages: write` added to the workflow.** No additional
  secrets needed — `GITHUB_TOKEN` works.
- **`publish-images` is a separate job** from `release` so a goreleaser
  failure doesn't kill image publishing and vice versa.

### Known limitations / follow-ups

- **First-time publishing requires a manual step.** GHCR packages default to
  private. After the first `v*` tag, an org admin has to flip
  `ghcr.io/sandboxnu/sarge-web` and `sarge-ws` to public visibility (Packages
  → package → settings → change visibility) or the installer will fail to
  pull with auth errors.
- **`NEXT_PUBLIC_*` baked at build time.** The image we push has whatever
  values were available during `docker build` — which in CI is nothing. So
  `NEXT_PUBLIC_WS_URL` and `NEXT_PUBLIC_APP_URL` will be undefined in the
  shipped bundle and the WS client falls back to `ws://localhost:8080`. Fix
  is to drop the env-var dependency in client code and derive WS URL from
  `window.location.hostname` (the Caddyfile already proxies
  `ws.<hostname>` → port 8080). Outside the scope of this CI change.
- **Pre-existing ECR-based prod deploy (`deploy-prod.yml`) is untouched.**
  GHCR is for self-hosters; ECR remains the prod hosted deploy path. Two
  registries, two audiences, on purpose.
- **No image signing / SBOMs yet.** Worth doing eventually
  (cosign + provenance) but not today.

## 2026-05-26 — `.env` generation

### Problem

`writeEnvFile` was only writing `DB_USER`, `DB_PASSWORD`, `DB_NAME`. The web
container would have started, found no `BETTER_AUTH_SECRET` / `JWT_SECRET`, and
crashed (or worse — booted with `undefined` as the JWT signing key).

There was also a second silent break: the install's compose template only
declared `DATABASE_URL` under `environment:` for the web service. Even if
`.env` had had the right vars in it, they would never have reached the
container.

### Fix

1. `writeEnvFile(hostname string)` now generates `BETTER_AUTH_SECRET` and
   `JWT_SECRET` as 32 random bytes hex-encoded, sets
   `BETTER_AUTH_URL=https://{hostname}` from the hostname the user just typed,
   and leaves AWS/email/judge vars as empty placeholders for the admin to fill
   in later.
2. Compose template now mounts `.env` into the web service via
   `env_file: - .env`. Confirmed `.env*` is in `.dockerignore`, so this is a
   pure runtime mount and won't leak secrets into the image layer.
3. Random generation factored into a small `randomHex(n int)` helper so the
   three call sites stay readable.
4. `BootstrapSarge` now takes `hostname` so it can be passed down to
   `writeEnvFile`. UI rebinds `tasks[bootstrap].run` when the hostname is
   submitted, mirroring the existing pattern for `tasks[hostname]`.

### Decisions / why

- **32 bytes for both secrets** (256 bits, 64-char hex). Plenty for HS256 and
  for better-auth's session signing.
- **Hex over base64.** The existing DB-password generation already used hex;
  staying consistent. No `=` padding, no URL-safety concerns.
- **Idempotent on re-run.** `writeEnvFile` still short-circuits when `.env`
  already exists, preserving any AWS/email values the admin has filled in.
- **Build-time `NEXT_PUBLIC_*` vars deliberately left out.** Next.js inlines
  these at build, and `.env*` is dockerignored, so just writing them to `.env`
  wouldn't help the web image at all. Right fix is build args (`ARG` in the
  Dockerfile + `build.args` in compose). Tracked as a follow-up.

### Known limitations / follow-ups

- `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_WS_URL` are still unset, so the
  client falls back to localhost for WS connections. The Dockerfile would
  need an `ARG NEXT_PUBLIC_WS_URL` (and friends) plumbed through compose
  `build.args` to make this work. Server-side auth flows are unaffected.
- AWS, judge, and email placeholders are left blank. Features that depend on
  them (invitations, file uploads, code execution) will fail until an admin
  edits `.env` and re-runs `docker compose up -d`.
- The hostname is taken at face value — no length check, no
  `https://`-stripping if a user pastes a URL.

## 2026-05-26 — Linux only (for now)

### Decision

Cut darwin/freebsd support across the board. Eventually we want darwin to
work too, but mixed OS conditionals were already accumulating (`runtime.GOOS`
branches, multi-OS goreleaser, darwin in the install shell), and the realistic
install target right now is a Linux VPS. Re-adding darwin later should be a
deliberate, tested addition — not a half-finished branch.

### Changes

- `CheckSystemRequirements` rejects anything but `linux` with a clear message.
- `ensureCaddy` hardcodes `os=linux` in the Caddy download URL (still uses
  `runtime.GOARCH` for amd64 vs arm64).
- Dropped the `runtime.GOOS != "linux"` short-circuits I had just added in
  `ensureCaddy` and `BootstrapCaddy` — unreachable now that the system check
  gates them.
- `.goreleaser.yaml`: `goos: [linux]` only.
- `install.sh`: `detect_os` rejects non-Linux with a message that names the
  limitation explicitly.
