# Raw SQL Migrations for Vitality v6y - Phase 3: Audit Dimensions
# Store normalized metrics from audits

CREATE TABLE IF NOT EXISTS audit_dimension (
  _id BIGSERIAL PRIMARY KEY,
  execution_id UUID NOT NULL REFERENCES audit_execution(id) ON DELETE CASCADE,
  app_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  source_id INTEGER NOT NULL REFERENCES audit_source(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  metric VARCHAR(255) NOT NULL,
  value FLOAT8,
  unit VARCHAR(50),
  status VARCHAR(50),
  trend FLOAT8,
  metadata JSONB,
  help_id INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  UNIQUE(execution_id, source_id, metric)
);

CREATE INDEX IF NOT EXISTS idx_audit_dimension_app_id ON audit_dimension(app_id);
CREATE INDEX IF NOT EXISTS idx_audit_dimension_app_metric_time ON audit_dimension(app_id, metric, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_dimension_source_id ON audit_dimension(source_id);
CREATE INDEX IF NOT EXISTS idx_audit_dimension_created_at ON audit_dimension(created_at DESC);
