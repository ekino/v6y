# Create canonical applications table

CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  acronym TEXT NOT NULL UNIQUE,
  contact_mail TEXT NOT NULL,
  description TEXT NOT NULL,
  repo JSON,
  configuration JSON,
  links JSON,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_applications_name_acronym ON applications(name, acronym);
