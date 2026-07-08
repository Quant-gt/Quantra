-- Add full_name to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Add slug to strategies
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS min_capital NUMERIC DEFAULT 10000;
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS fee NUMERIC DEFAULT 0;
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS profit_share NUMERIC DEFAULT 0;

-- Create user_watchlist table
CREATE TABLE IF NOT EXISTS user_watchlist (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  strategy_id UUID REFERENCES strategies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, strategy_id)
);

CREATE INDEX IF NOT EXISTS user_watchlist_strategy_id_idx ON user_watchlist (strategy_id);

-- Mock metrics table for the view
CREATE TABLE IF NOT EXISTS strategy_metrics (
  strategy_id UUID PRIMARY KEY REFERENCES strategies(id) ON DELETE CASCADE,
  cagr NUMERIC DEFAULT 0,
  max_drawdown NUMERIC DEFAULT 0,
  sharpe_ratio NUMERIC DEFAULT 0,
  win_rate NUMERIC DEFAULT 0,
  subscriber_count INTEGER DEFAULT 0,
  total_trades INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create marketplace_strategies VIEW (with SECURITY INVOKER to enforce RLS)
CREATE OR REPLACE VIEW public.marketplace_strategies WITH (security_invoker = true) AS
SELECT 
  s.id,
  s.name,
  s.slug,
  s.type as classification,
  s.algo_id,
  s.status,
  s.min_capital,
  s.fee,
  s.profit_share,
  s.creator_id,
  u.full_name as creator_name,
  u.ra_verified as creator_ra_verified,
  m.cagr,
  m.max_drawdown,
  m.sharpe_ratio,
  m.win_rate,
  m.subscriber_count,
  m.total_trades
FROM strategies s
LEFT JOIN users u ON s.creator_id = u.id
LEFT JOIN strategy_metrics m ON s.id = m.strategy_id
WHERE s.status = 'live';
