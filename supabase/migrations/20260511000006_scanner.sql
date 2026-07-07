-- Create scanner_configs table
CREATE TABLE IF NOT EXISTS scanner_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  filter_graph JSONB NOT NULL DEFAULT '{}'::jsonb, -- React Flow DAG for filters
  schedule TEXT DEFAULT 'on_demand', -- on_demand, market_open, every_15_mins
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for scan history/results
CREATE TABLE IF NOT EXISTS scan_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scanner_config_id UUID REFERENCES scanner_configs(id) ON DELETE CASCADE,
  results JSONB NOT NULL, -- List of matching symbols
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for lookup
CREATE INDEX IF NOT EXISTS scanner_configs_user_id_idx ON scanner_configs(user_id);
CREATE INDEX IF NOT EXISTS scan_results_scanner_config_id_idx ON scan_results(scanner_config_id);
