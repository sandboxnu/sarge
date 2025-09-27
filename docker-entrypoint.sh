#!/usr/bin/env sh
# docker-entrypoint.sh
# This script is ran on every deploy within our production docker container
set -eu
echo "Running Prisma migrations..."
npx prisma migrate deploy
echo "Starting app..."
exec "$@"
