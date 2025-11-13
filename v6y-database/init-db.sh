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
  psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<-EOSQL
    INSERT INTO accounts (username, email, password, role, created_at, updated_at, applications)
    VALUES (
      'superadmin', 
      'superadmin@example.com', 
      '\$2a\$10\$fSDUAlp4s8gJNc7HtZdMdeevQHAyRgCy6knbL1QQz3pHstXSbWm0W', 
      'SUPERADMIN', 
      NOW(), 
      NOW(), 
      ARRAY[]::integer[]
    )
    ON CONFLICT (username) DO NOTHING;
EOSQL
  
  touch /var/lib/postgresql/data/.initialized
  echo "Database restore completed!"
else
  echo "Database already initialized, skipping restore."
fi
