# Raw SQL Migrations for Vitality v6y - Phase 7: Metric History
# Time-series data for trend analysis

CREATE TABLE IF NOT EXISTS metric_history (
  _id BIGSERIAL PRIMARY KEY,
  app_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  metric VARCHAR(255) NOT NULL,
  period VARCHAR(50) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  avg_value FLOAT8,
  min_value FLOAT8,
  max_value FLOAT8,
  trend FLOAT8,
  data_points INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  UNIQUE(app_id, metric, period, period_start),
  CHECK (period IN ('DAILY', 'WEEKLY', 'MONTHLY'))
);

CREATE INDEX IF NOT EXISTS idx_metric_history_app_metric_time ON metric_history(app_id, metric, period_start DESC);
CREATE INDEX IF NOT EXISTS idx_metric_history_app_id ON metric_history(app_id);
