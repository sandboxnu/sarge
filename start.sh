#!/bin/bash

docker compose up -d db && pnpm install && npm run dev
