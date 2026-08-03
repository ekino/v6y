#!/bin/bash

# One-command local setup: env file, database, migrations and seed data.
# After this, `pnpm run start:dev:all` (or `docker compose up`) is enough.

set -e

cd "$(dirname "$0")/.."

echo "Setting up your .env file..."
node scripts/setup-env.js
echo ""

if ! command -v docker >/dev/null 2>&1; then
  echo "⚠️  Docker isn't installed - install Docker Desktop, then re-run 'pnpm run setup'"
  echo "   to start the database and apply migrations. See README.md for a fully manual,"
  echo "   Docker-free alternative (local PostgreSQL + 'pnpm run init-db')."
  exit 0
fi

if ! docker info >/dev/null 2>&1; then
  echo "⚠️  Docker is installed but not running - start Docker Desktop, then re-run"
  echo "   'pnpm run setup' to start the database and apply migrations."
  exit 0
fi

echo "Starting the database..."
docker compose up -d v6y-database
echo ""

echo "Applying migrations and seeding reference data..."
docker compose run --rm v6y-migrate
echo ""

echo "✅ Setup complete. Start everything with 'pnpm run start:dev:all'."
