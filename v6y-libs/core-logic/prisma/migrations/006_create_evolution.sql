# Raw SQL Migrations for Vitality v6y - Phase 6: Evolution Tracking
# Track code and infrastructure changes

CREATE TABLE IF NOT EXISTS evolution (
  _id SERIAL PRIMARY KEY,
  app_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  audit_execution_id UUID NOT NULL REFERENCES audit_execution(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  metric VARCHAR(255),
  old_value VARCHAR(1000),
  new_value VARCHAR(1000),
  change_type VARCHAR(50),
  impact VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CHECK (change_type IN ('UPGRADE', 'DOWNGRADE', 'NEW', 'REMOVED')),
  CHECK (impact IN ('MAJOR', 'MINOR', 'PATCH'))
);

CREATE INDEX IF NOT EXISTS idx_evolution_app_id ON evolution(app_id);
CREATE INDEX IF NOT EXISTS idx_evolution_created_at ON evolution(created_at DESC);
