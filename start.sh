#!/bin/bash
# start.sh
# This script is for developers to use during local development
cleanup() {
    docker compose down
    exit 0
}

trap cleanup SIGINT SIGTERM

if ! command -v vc >/dev/null 2>&1; then
    echo "Vercel CLI not found. Install it with: pnpm add -g vercel"
    exit 1
fi

# vc dev (not next dev) is required for the /api/ws WebSocket route
docker compose up -d db && pnpm install && pnpm run dev:migrate && vc dev --listen 3000
