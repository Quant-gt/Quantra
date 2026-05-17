-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. ALTER EXISTING USERS TABLE (Add missing columns safely)
alter table public.users 
  add column if not exists pan_number text unique,
  add column if not exists is_creator boolean default false,
  add column if not exists subscription_tier text check (subscription_tier in ('hobbyist', 'pro', 'institutional')) default 'hobbyist',
  add column if not exists subscription_status text check (subscription_status in ('active', 'past_due', 'canceled')) default 'active',
  add column if not exists preferences jsonb default '{}'::jsonb;

-- 1.5 USER PAYMENTS (Dedicated Table for SaaS Billing)
create table if not exists public.user_payments (
  user_id uuid references public.users(id) on delete cascade primary key,
  razorpay_customer_id text not null,
  razorpay_subscription_id text,
  last_payment_status text check (last_payment_status in ('success', 'failed', 'pending')),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. USER KYC (For Creators and Compliance)
create table if not exists public.user_kyc (
  user_id uuid references public.users(id) on delete cascade primary key,
  pan_verified boolean default false,
  sebi_registration_number text,
  is_ria boolean default false,
  razorpay_connect_account_id text,
  kyc_status text check (kyc_status in ('pending', 'approved', 'rejected')) default 'pending',
  verified_at timestamp with time zone
);

-- 3. BROKER CONNECTIONS
create table if not exists public.broker_connections (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  broker text check (broker in ('fyers', 'zerodha', 'upstox', 'angelone')) not null,
  client_id text not null,
  api_key text not null,
  api_secret text not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, broker)
);

-- 4. STRATEGIES (The Algos) - Alter existing table
alter table public.strategies
  add column if not exists is_public_marketplace boolean default false,
  add column if not exists monthly_fee numeric(10, 2) default 0.00,
  add column if not exists status text check (status in ('draft', 'published', 'suspended')) default 'draft',
  add column if not exists logic_graph jsonb not null default '{}'::jsonb;

-- 5. MARKETPLACE SUBSCRIPTIONS
create table if not exists public.marketplace_subscriptions (
  id uuid default uuid_generate_v4() primary key,
  subscriber_id uuid references public.users(id) on delete cascade not null,
  strategy_id uuid references public.strategies(id) on delete cascade not null,
  razorpay_subscription_id text,
  status text check (status in ('active', 'canceled', 'past_due')) default 'active',
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(subscriber_id, strategy_id)
);

-- 6. EXECUTION LOGS
create table if not exists public.execution_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  strategy_id uuid references public.strategies(id) on delete set null,
  symbol text not null,
  action text check (action in ('BUY', 'SELL')) not null,
  quantity integer not null,
  price numeric(10, 2) not null,
  execution_type text check (execution_type in ('paper', 'live', 'backtest')) not null,
  status text check (status in ('success', 'failed', 'rejected')) not null,
  broker_order_id text,
  trade_time timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;
alter table public.user_payments enable row level security;
alter table public.user_kyc enable row level security;
alter table public.broker_connections enable row level security;
alter table public.strategies enable row level security;
alter table public.marketplace_subscriptions enable row level security;
alter table public.execution_logs enable row level security;

-- Policies (using IF NOT EXISTS logic implicitly by dropping first if needed, but in Supabase you can just run them, 
-- or we use DO blocks. For simplicity, we just create them. If policies exist, it will error, so we drop them first to be safe)

drop policy if exists "Users can view own profile" on public.users;
drop policy if exists "Users can update own profile" on public.users;
drop policy if exists "Users can view own KYC" on public.user_kyc;
drop policy if exists "Users can view own brokers" on public.broker_connections;
drop policy if exists "Users can view own execution logs" on public.execution_logs;
drop policy if exists "Anyone can view public strategies" on public.strategies;
drop policy if exists "Creators can manage own strategies" on public.strategies;

create policy "Users can view own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);
create policy "Users can view own KYC" on public.user_kyc for select using (auth.uid() = user_id);
create policy "Users can view own brokers" on public.broker_connections for select using (auth.uid() = user_id);
create policy "Users can view own execution logs" on public.execution_logs for select using (auth.uid() = user_id);
create policy "Anyone can view public strategies" on public.strategies for select using (is_public_marketplace = true);
create policy "Creators can manage own strategies" on public.strategies for all using (auth.uid() = creator_id);
