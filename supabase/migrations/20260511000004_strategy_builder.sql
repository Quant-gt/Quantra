-- Add logic_graph column to strategies table
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS logic_graph JSONB DEFAULT '{}'::jsonb;

-- Create strategy_versions table for version history
CREATE TABLE IF NOT EXISTS strategy_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id UUID REFERENCES strategies(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  logic_graph JSONB NOT NULL,
  change_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(strategy_id, version_number)
);

-- Index for faster lookup of history
CREATE INDEX IF NOT EXISTS strategy_versions_strategy_id_idx ON strategy_versions(strategy_id);
