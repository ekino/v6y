# Raw SQL Migrations for Vitality v6y - Phase 1: Foundation
# Create new audit execution tracking table
# This groups all metrics from a single audit run

CREATE TABLE IF NOT EXISTS audit_execution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id INTEGER NOT NULL REFERENCES "Application"(_id) ON DELETE CASCADE,
  executed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,
  initiated_by VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  batch_id VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CONSTRAINT status_check CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'))
);

CREATE INDEX idx_audit_execution_app_id ON audit_execution(app_id);
CREATE INDEX idx_audit_execution_executed_at ON audit_execution(executed_at DESC);
