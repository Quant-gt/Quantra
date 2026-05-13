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
