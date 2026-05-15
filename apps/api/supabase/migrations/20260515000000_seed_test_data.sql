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
