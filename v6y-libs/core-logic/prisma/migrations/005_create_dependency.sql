# Raw SQL Migrations for Vitality v6y - Phase 5: Dependency Tracking
# Modern dependency management with vulnerability tracking

DROP TABLE IF EXISTS "Dependency" CASCADE;

CREATE TABLE IF NOT EXISTS dependency (
  _id SERIAL PRIMARY KEY,
  app_id INTEGER NOT NULL REFERENCES "Application"(_id) ON DELETE CASCADE,
  audit_execution_id UUID NOT NULL REFERENCES audit_execution(id) ON DELETE CASCADE,
  ecosystem_type VARCHAR(50) NOT NULL,
  package_name VARCHAR(500) NOT NULL,
  current_version VARCHAR(100),
  latest_version VARCHAR(100),
  status VARCHAR(50),
  vulnerability_count INTEGER NOT NULL DEFAULT 0,
  max_severity VARCHAR(50),
  update_available BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  UNIQUE(app_id, ecosystem_type, package_name, created_at),
  CHECK (ecosystem_type IN ('npm', 'pip', 'maven', 'nuget', 'cargo', 'composer', 'gem'))
);

CREATE INDEX idx_dependency_app_id ON dependency(app_id);
CREATE INDEX idx_dependency_app_status ON dependency(app_id, status);
CREATE INDEX idx_dependency_severity ON dependency(max_severity);
