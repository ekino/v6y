#!/bin/bash
set -e

until pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

if [ ! -f /var/lib/postgresql/data/.initialized ]; then
  echo "Restoring database from dump..."
  pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v /docker-entrypoint-initdb.d/v6y_database || true
  
  echo "Creating default superadmin user..."

  SA_USERNAME=${SUPERADMIN_USERNAME}
  SA_EMAIL=${SUPERADMIN_EMAIL}
  SA_PASSWORD=${SUPERADMIN_PASSWORD}

  _quote_sql() {
    printf '%s' "$1" | sed "s/'/''/g"
  }

  sql="INSERT INTO accounts (username, email, password, role, created_at, updated_at, applications) VALUES ('$(_quote_sql "$SA_USERNAME")', '$(_quote_sql "$SA_EMAIL")', '$(_quote_sql "$SA_PASSWORD")', 'SUPERADMIN', NOW(), NOW(), ARRAY[]::integer[]) ON CONFLICT (username) DO NOTHING;"

  psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "$sql"
  
  touch /var/lib/postgresql/data/.initialized
  echo "Database restore completed!"
else
  echo "Database already initialized, skipping restore."
fi
