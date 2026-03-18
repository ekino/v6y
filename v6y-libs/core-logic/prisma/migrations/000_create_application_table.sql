# Create legacy Application table
# This table is managed by Sequelize ORM but required by new audit schema migrations

CREATE TABLE IF NOT EXISTS "Application" (
  "_id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "acronym" TEXT NOT NULL UNIQUE,
  "contactMail" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "repo" JSON,
  "configuration" JSON,
  "links" JSON,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_application_name_acronym" ON "Application"("name", "acronym");
