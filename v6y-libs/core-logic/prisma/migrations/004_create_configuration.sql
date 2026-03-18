# Raw SQL Migrations for Vitality v6y - Phase 4: Configuration Management
# Store tool configuration per application

CREATE TABLE IF NOT EXISTS configuration (
  _id SERIAL PRIMARY KEY,
  app_id INTEGER NOT NULL REFERENCES "Application"(_id) ON DELETE CASCADE,
  tool_name VARCHAR(100) NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  credentials JSONB,
  settings JSONB,
  webhook_url VARCHAR(500),
  last_synced_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  UNIQUE(app_id, tool_name),
  CONSTRAINT tool_name_not_empty CHECK (tool_name != ''),
  CONSTRAINT valid_tool_name CHECK (tool_name IN (
    'SONARQUBE', 'DATADOG', 'LIGHTHOUSE', 'STATIC_CODE', 'DEVOPS',
    'PROMETHEUS', 'NEW_TOOL_PLACEHOLDER'
  ))
);

CREATE INDEX idx_configuration_app_id ON configuration(app_id);
CREATE INDEX idx_configuration_enabled ON configuration(app_id, is_enabled);
