#!/bin/bash
# Docker initialization script for Vitality v6y database
# This script is mounted and executed during PostgreSQL container startup
# Location: /docker-entrypoint-initdb.d/30-prisma-migrations.sh

set -e

echo "=== Starting Prisma migration initialization ==="

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
until pg_isready -h localhost -U ${PSQL_DB_USER} -d ${PSQL_DB_NAME}; do
  sleep 1
done

echo "PostgreSQL is ready!"

# Check if we need to run migrations
echo "Checking if database needs initialization..."

# Query to check if our new tables exist
TABLES_EXIST=$(psql -h localhost -U ${PSQL_DB_USER} -d ${PSQL_DB_NAME} -tc \
  "SELECT COUNT(*) FROM information_schema.tables WHERE table_name IN ('audit_execution', 'audit_dimension');")

if [ "$TABLES_EXIST" -gt 0 ]; then
  echo "✓ Database appears to be already initialized. Skipping migrations."
  exit 0
fi

echo "=== Running Prisma migrations ==="

# Run migration files in order
cd /app/v6y-libs/core-logic

echo "Executing migration: 001_create_audit_execution.sql"
psql -h localhost -U ${PSQL_DB_USER} -d ${PSQL_DB_NAME} < prisma/migrations/001_create_audit_execution.sql

echo "Executing migration: 002_create_audit_source.sql"
psql -h localhost -U ${PSQL_DB_USER} -d ${PSQL_DB_NAME} < prisma/migrations/002_create_audit_source.sql

echo "Executing migration: 003_create_audit_dimension.sql"
psql -h localhost -U ${PSQL_DB_USER} -d ${PSQL_DB_NAME} < prisma/migrations/003_create_audit_dimension.sql

echo "Executing migration: 004_create_configuration.sql"
psql -h localhost -U ${PSQL_DB_USER} -d ${PSQL_DB_NAME} < prisma/migrations/004_create_configuration.sql

echo "Executing migration: 005_create_dependency.sql"
psql -h localhost -U ${PSQL_DB_USER} -d ${PSQL_DB_NAME} < prisma/migrations/005_create_dependency.sql

echo "Executing migration: 006_create_evolution.sql"
psql -h localhost -U ${PSQL_DB_USER} -d ${PSQL_DB_NAME} < prisma/migrations/006_create_evolution.sql

echo "Executing migration: 007_create_metric_history.sql"
psql -h localhost -U ${PSQL_DB_USER} -d ${PSQL_DB_NAME} < prisma/migrations/007_create_metric_history.sql

echo "=== All Prisma migrations completed successfully ==="
