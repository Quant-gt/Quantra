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
