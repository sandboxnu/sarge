#!/bin/bash

docker compose up -d db && pnpm install && pnpm run dev
