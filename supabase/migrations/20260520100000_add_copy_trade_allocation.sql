-- Add Hybrid Architecture columns to strategies
ALTER TABLE public.strategies 
ADD COLUMN IF NOT EXISTS strategy_type text CHECK (strategy_type IN ('copy_trade', 'template')) DEFAULT 'copy_trade';

-- Add allocation and targeting to marketplace subscriptions
ALTER TABLE public.marketplace_subscriptions
ADD COLUMN IF NOT EXISTS target_symbol text,
ADD COLUMN IF NOT EXISTS allocation_multiplier numeric(5,2) DEFAULT 1.00;

-- Update the existing mock data or set defaults if necessary
-- For template strategies, users MUST provide a target_symbol. We can enforce this at the application level.
