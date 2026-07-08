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
CREATE INDEX IF NOT EXISTS creator_earnings_strategy_id_idx ON creator_earnings(strategy_id);
