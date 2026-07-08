-- Migration: saas_billing_and_route
-- Description: Creates schema for Razorpay Subscriptions (4-Tier Matrix) and Razorpay Route (Multi-party settlement)

-- 1. Create creator_settlement_accounts for Razorpay Route
CREATE TABLE IF NOT EXISTS public.creator_settlement_accounts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    razorpay_account_id text NOT NULL, -- e.g., acc_...
    status text DEFAULT 'created' CHECK (status IN ('created', 'activated', 'suspended')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(creator_id)
);

ALTER TABLE public.creator_settlement_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view their own settlement account" 
    ON public.creator_settlement_accounts FOR SELECT 
    USING (creator_id = (SELECT auth.uid()) OR public.is_admin());

CREATE POLICY "Admin can manage settlement accounts" 
    ON public.creator_settlement_accounts FOR ALL 
    USING (public.is_admin());


-- 2. Create user_subscriptions for the 4-Tier SaaS model
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    subscription_type text NOT NULL CHECK (subscription_type IN ('buyer', 'creator')),
    tier_name text NOT NULL, 
    price_inr numeric(10, 2) NOT NULL,
    razorpay_subscription_id text UNIQUE,
    status text DEFAULT 'active' CHECK (status IN ('created', 'active', 'past_due', 'cancelled')),
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, subscription_type) -- A user can have 1 active buyer sub and 1 active creator sub
);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own SaaS subscriptions" 
    ON public.user_subscriptions FOR SELECT 
    USING (user_id = (SELECT auth.uid()) OR public.is_admin());

CREATE POLICY "Admin manages SaaS subscriptions" 
    ON public.user_subscriptions FOR ALL 
    USING (public.is_admin());


-- 3. Update marketplace_subscriptions for Razorpay recurring billing
ALTER TABLE public.marketplace_subscriptions ADD COLUMN IF NOT EXISTS razorpay_subscription_id text UNIQUE;
ALTER TABLE public.marketplace_subscriptions ADD COLUMN IF NOT EXISTS current_period_end timestamp with time zone;
