-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;
-- Update users table with SEBI compliance fields
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS static_ip_v4 TEXT,
ADD COLUMN IF NOT EXISTS static_ip_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS ra_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ra_license_no TEXT,
ADD COLUMN IF NOT EXISTS ra_expiry_date TIMESTAMP WITH TIME ZONE;

-- Create strategies table
CREATE TABLE IF NOT EXISTS strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('white_box', 'black_box')),
  algo_id TEXT UNIQUE,
  algo_id_expiry TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT black_box_requires_ra CHECK (
    type = 'white_box' OR (type = 'black_box' AND algo_id IS NOT NULL)
  )
);

-- Create marketplace_subscriptions table
CREATE TABLE IF NOT EXISTS marketplace_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  strategy_id UUID REFERENCES strategies(id) ON DELETE CASCADE,
  mode TEXT CHECK (mode IN ('paper', 'live')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'daily_auth_expired', 'cancelled')),
  current_ops NUMERIC DEFAULT 0,
  session_valid_until TIMESTAMP WITH TIME ZONE,
  last_daily_2fa_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create compliance_audit table
CREATE TABLE IF NOT EXISTS compliance_audit (
  id UUID DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  algo_id TEXT,
  static_ip TEXT,
  api_key_hash TEXT,
  event_type TEXT,
  symbol TEXT,
  qty INTEGER,
  price NUMERIC,
  broker_order_id TEXT,
  broker_status TEXT,
  ops_at_event NUMERIC,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id, created_at)
);

-- Note: We assume TimescaleDB extension is enabled.
-- In a real Supabase instance, we would run: SELECT create_hypertable('compliance_audit', 'created_at');

-- Create admin_alerts table
CREATE TABLE IF NOT EXISTS admin_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  strategy_id UUID REFERENCES strategies(id),
  alert_type TEXT,
  message TEXT,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
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
-- Add embedding column to strategies
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS embedding vector(384);

-- Create IVFFlat index for similarity search
CREATE INDEX IF NOT EXISTS strategies_embedding_idx ON strategies USING ivfflat (embedding vector_cosine_ops) WITH (lists=100);

-- Also prepare fulltext search tsvector column
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A')
) STORED;

CREATE INDEX IF NOT EXISTS strategies_search_idx ON strategies USING GIN (search_vector);

-- RPC function for hybrid magic search
-- Combines: 50% semantic similarity + 30% cagr + 20% popularity
CREATE OR REPLACE FUNCTION search_magic_strategies(
  query_embedding vector(384),
  match_threshold float,
  match_count int,
  fulltext_query text DEFAULT NULL
) RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  algo_id text,
  classification text,
  min_capital numeric,
  fee numeric,
  cagr numeric,
  max_drawdown numeric,
  subscriber_count int,
  similarity float,
  final_score float
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  WITH semantic_matches AS (
    SELECT 
      s.id,
      1 - (s.embedding <=> query_embedding) as similarity
    FROM strategies s
    WHERE 1 - (s.embedding <=> query_embedding) > match_threshold
      AND s.status = 'live'
  ),
  fulltext_matches AS (
    SELECT 
      s.id,
      ts_rank(s.search_vector, to_tsquery('english', fulltext_query)) as similarity
    FROM strategies s
    WHERE s.search_vector @@ to_tsquery('english', fulltext_query)
      AND s.status = 'live'
  ),
  combined_matches AS (
    SELECT id, similarity FROM semantic_matches
    UNION
    SELECT id, similarity FROM fulltext_matches
  )
  SELECT 
    s.id,
    s.name,
    s.slug,
    s.algo_id,
    s.type as classification,
    s.min_capital,
    s.fee,
    COALESCE(m.cagr, 0) as cagr,
    COALESCE(m.max_drawdown, 0) as max_drawdown,
    COALESCE(m.subscriber_count, 0) as subscriber_count,
    cm.similarity,
    (
      (cm.similarity * 0.5) + 
      ((COALESCE(m.cagr, 0) / 100.0) * 0.3) + 
      ((LEAST(COALESCE(m.subscriber_count, 0), 1000) / 1000.0) * 0.2)
    ) as final_score
  FROM combined_matches cm
  JOIN strategies s ON cm.id = s.id
  LEFT JOIN strategy_metrics m ON s.id = m.strategy_id
  ORDER BY final_score DESC
  LIMIT match_count;
END;
$$;
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
-- Create backtest_results table
CREATE TABLE IF NOT EXISTS backtest_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id UUID REFERENCES strategies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, running, completed, failed
  date_range JSONB, -- { start: '...', end: '...' }
  metrics JSONB, -- { cagr: ..., sharpe: ..., max_drawdown: ... }
  equity_curve JSONB, -- [ { date: '...', value: ... }, ... ]
  trade_log JSONB, -- [ { entry_time: '...', exit_time: '...', pnl: ... }, ... ]
  parameters JSONB, -- The parameters used for this run
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for lookup
CREATE INDEX IF NOT EXISTS backtest_results_strategy_id_idx ON backtest_results(strategy_id);
CREATE INDEX IF NOT EXISTS backtest_results_user_id_idx ON backtest_results(user_id);
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
-- Create broker_connections table
CREATE TABLE IF NOT EXISTS broker_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  broker_name TEXT NOT NULL, -- zerodha, upstox, angelone
  encrypted_access_token TEXT NOT NULL,
  encrypted_refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'connected', -- connected, disconnected, auth_required
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, broker_name)
);

-- Ensure marketplace_subscriptions has status for kill switch
-- And columns for P&L tracking
ALTER TABLE marketplace_subscriptions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE marketplace_subscriptions ADD COLUMN IF NOT EXISTS today_pnl NUMERIC DEFAULT 0;
ALTER TABLE marketplace_subscriptions ADD COLUMN IF NOT EXISTS unrealised_pnl NUMERIC DEFAULT 0;

-- Create index
CREATE INDEX IF NOT EXISTS broker_connections_user_id_idx ON broker_connections(user_id);
-- Materialized view for portfolio performance
-- In a real app with pg_cron: 
-- SELECT cron.schedule('refresh_portfolio_stats', '0 0 * * *', 'REFRESH MATERIALIZED VIEW portfolio_stats');

CREATE MATERIALIZED VIEW IF NOT EXISTS portfolio_stats AS
SELECT 
  user_id,
  SUM(today_pnl) as total_today_pnl,
  SUM(unrealised_pnl) as total_unrealised_pnl,
  COUNT(id) as active_strategies_count
FROM marketplace_subscriptions
WHERE status = 'active'
GROUP BY user_id;

-- Unique index required for concurrent refresh
CREATE UNIQUE INDEX IF NOT EXISTS portfolio_stats_user_id_idx ON portfolio_stats (user_id);
-- Add telegram_chat_id to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT;

-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  push_trade_alerts BOOLEAN DEFAULT true,
  email_trade_alerts BOOLEAN DEFAULT false,
  telegram_trade_alerts BOOLEAN DEFAULT false,
  push_compliance_alerts BOOLEAN DEFAULT true, -- SEBI alerts usually forced true in logic
  email_compliance_alerts BOOLEAN DEFAULT true,
  email_marketing BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS notification_preferences_user_id_idx ON notification_preferences(user_id);
-- Create creator_earnings table
CREATE TABLE IF NOT EXISTS creator_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  strategy_id UUID REFERENCES strategies(id) ON DELETE CASCADE,
  month_year TEXT NOT NULL, -- e.g., "2026-04"
  total_pnl NUMERIC DEFAULT 0,
  profit_share_amount NUMERIC DEFAULT 0,
  platform_cut NUMERIC DEFAULT 0,
  net_payout NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending, paid, failed
  payout_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS creator_earnings_creator_id_idx ON creator_earnings(creator_id);
CREATE INDEX IF NOT EXISTS creator_earnings_month_year_idx ON creator_earnings(month_year);
-- Seed test data for compliance testing

-- Insert test user
INSERT INTO users (id, email, full_name)
VALUES ('00000000-0000-0000-0000-000000000001', 'test@example.com', 'Test User')
ON CONFLICT (id) DO NOTHING;

-- Insert test strategy
INSERT INTO strategies (id, creator_id, name, type, algo_id, status)
VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Test Strategy', 'white_box', 'ALGO-123', 'live')
ON CONFLICT (id) DO NOTHING;

-- Insert test subscription
INSERT INTO marketplace_subscriptions (id, user_id, strategy_id, mode, status, current_ops, session_valid_until, last_daily_2fa_at)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  'live',
  'active',
  0,
  NOW() + INTERVAL '1 day',
  NOW()
)
ON CONFLICT (id) DO NOTHING;
-- Migration: enable_rls_for_api_tables
-- Description: Enables Row-Level Security (RLS) and defines secure policies for all exposed API tables.

-- ========================================================
-- 1. COMPLIANCE AUDIT
-- ========================================================
ALTER TABLE public.compliance_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own compliance audit" ON public.compliance_audit;
CREATE POLICY "Users can view own compliance audit" 
ON public.compliance_audit 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- ========================================================
-- 2. ADMIN ALERTS
-- ========================================================
ALTER TABLE public.admin_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own admin alerts" ON public.admin_alerts;
CREATE POLICY "Users can view own admin alerts" 
ON public.admin_alerts 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- ========================================================
-- 3. USER WATCHLIST (Singular - from API migrations)
-- ========================================================
ALTER TABLE public.user_watchlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own watchlist" ON public.user_watchlist;
CREATE POLICY "Users can manage own watchlist" 
ON public.user_watchlist 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ========================================================
-- 4. STRATEGY METRICS
-- ========================================================
ALTER TABLE public.strategy_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view strategy metrics" ON public.strategy_metrics;
CREATE POLICY "Anyone can view strategy metrics" 
ON public.strategy_metrics 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- ========================================================
-- 5. STRATEGY VERSIONS
-- ========================================================
ALTER TABLE public.strategy_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Creators can view own strategy versions" ON public.strategy_versions;
CREATE POLICY "Creators can view own strategy versions" 
ON public.strategy_versions 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.strategies s
    WHERE s.id = strategy_versions.strategy_id
    AND s.creator_id = auth.uid()
  )
);

-- ========================================================
-- 6. BACKTEST RESULTS
-- ========================================================
ALTER TABLE public.backtest_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own backtest results" ON public.backtest_results;
CREATE POLICY "Users can manage own backtest results" 
ON public.backtest_results 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ========================================================
-- 7. SCANNER CONFIGS
-- ========================================================
ALTER TABLE public.scanner_configs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own scanner configs" ON public.scanner_configs;
CREATE POLICY "Users can manage own scanner configs" 
ON public.scanner_configs 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ========================================================
-- 8. SCAN RESULTS
-- ========================================================
ALTER TABLE public.scan_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own scan results" ON public.scan_results;
CREATE POLICY "Users can view own scan results" 
ON public.scan_results 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.scanner_configs c
    WHERE c.id = scan_results.scanner_config_id
    AND c.user_id = auth.uid()
  )
);

-- ========================================================
-- 9. NOTIFICATION PREFERENCES
-- ========================================================
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can manage own notification preferences" 
ON public.notification_preferences 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ========================================================
-- 10. CREATOR EARNINGS
-- ========================================================
ALTER TABLE public.creator_earnings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Creators can view own earnings" ON public.creator_earnings;
CREATE POLICY "Creators can view own earnings" 
ON public.creator_earnings 
FOR SELECT 
TO authenticated 
USING (auth.uid() = creator_id);
