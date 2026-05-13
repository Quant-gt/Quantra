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
