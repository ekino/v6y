#!/usr/bin/env bash
set -euo pipefail

# Start Postgres using the db-only compose file, wait for readiness, run local pnpm init-db,
# then execute the superadmin insert inside the Postgres container.

COMPOSE_FILE=docker-compose.db.yml

DB_SERVICE=v6y-postgres
DB_USER=${PSQL_DB_USER:-postgres}
DB_NAME=${PSQL_DB_NAME:-v6y}

# Load .env if present (don't overwrite existing env vars)
if [ -f .env ]; then
  set -o allexport
  # shellcheck disable=SC1090
  source .env
  set +o allexport
fi

DEFAULT_ACCOUNT=${DEFAULT_ACCOUNT:-superadmin}
DEFAULT_ACCOUNT_MAIL=${DEFAULT_ACCOUNT_MAIL:-superadmin@example.com}
DEFAULT_ACCOUNT_PASSWORD_HASH=${DEFAULT_ACCOUNT_PASSWORD_HASH:-$2a$10$fSDUAlp4s8gJNc7HtZdMdeevQHAyRgCy6knbL1QQz3pHstXSbWm0W}

echo "Starting Postgres container..."
docker compose -f "$COMPOSE_FILE" up -d "$DB_SERVICE"

echo "Waiting for Postgres to be ready inside container $DB_SERVICE..."
for i in {1..60}; do
  if docker exec "$DB_SERVICE" pg_isready -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; then
    echo "Postgres ready"
    break
  fi
  sleep 1
done

echo "Running local DB initialization (pnpm run init-db)..."
pnpm run init-db

echo "Seeding superadmin account inside Postgres container..."
docker exec -i "$DB_SERVICE" psql -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 <<SQL
BEGIN;
INSERT INTO accounts (username, email, password, role, created_at, updated_at, applications)
SELECT '${DEFAULT_ACCOUNT}', '${DEFAULT_ACCOUNT_MAIL}', '${DEFAULT_ACCOUNT_PASSWORD_HASH}', 'SUPERADMIN', NOW(), NOW(), ARRAY[]::integer[]
WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE username = '${DEFAULT_ACCOUNT}');
COMMIT;
SQL

echo "Done."
