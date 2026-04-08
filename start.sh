#!/bin/bash
# start.sh
# This script is for developers to use during local development
cleanup() {
    docker compose down
    exit 0
}

trap cleanup SIGINT SIGTERM

docker compose up -d db ws judge0-api judge0-worker judge0-db judge0-redis && pnpm install && pnpm run dev
