#!/usr/bin/env sh
# docker-entrypoint.sh
# This script is ran on every deploy within our production docker container
set -eu
echo "Running Prisma migrations (if a database is configured)..."
node scripts/migrate.mjs deploy
echo "Starting app..."
exec "$@"
