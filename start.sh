#!/bin/bash

cleanup() {
    docker compose down
    exit 0
}

trap cleanup SIGINT SIGTERM

docker compose up -d db && pnpm install && pnpm run dev
