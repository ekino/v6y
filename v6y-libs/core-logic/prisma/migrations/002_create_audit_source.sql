# Raw SQL Migrations for Vitality v6y - Phase 2: Audit Sources
# Track which tools are available and their configuration

CREATE TABLE IF NOT EXISTS audit_source (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(255),
  description TEXT,
  version VARCHAR(50),
  is_active BOOLEAN NOT NULL DEFAULT true,
  min_version VARCHAR(50),
  configuration JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CONSTRAINT name_not_empty CHECK (name != '')
);

-- Seed initial audit sources
INSERT INTO audit_source (name, display_name, description, version, is_active)
VALUES
  ('STATIC_CODE', 'Static Code Analysis', 'Analyzes code quality and security violations using static analysis', '1.0', true),
  ('LIGHTHOUSE', 'Lighthouse Audits', 'Web performance, accessibility, and best practices auditing', '11.0', true),
  ('DEVOPS', 'DevOps Metrics', 'Deployment frequency, lead time, and infrastructure metrics', '1.0', true),
  ('SONARQUBE', 'SonarQube', 'Code quality metrics from SonarQube platform', '9.9', false),
  ('DATADOG', 'Datadog Monitoring', 'Real-time application performance metrics from Datadog', '1.0', false)
ON CONFLICT (name) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_audit_source_is_active ON audit_source(is_active);
