-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS TABLE (Extends Supabase Auth)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text unique not null,
  phone_number text,
  pan_number text unique, -- CRITICAL: For SEBI compliance and KYC
  is_creator boolean default false,
  
  -- Platform SaaS Subscription
  subscription_tier text check (subscription_tier in ('hobbyist', 'pro', 'institutional')) default 'hobbyist',
  subscription_status text check (subscription_status in ('active', 'past_due', 'canceled')) default 'active',
  preferences jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1.5 USER PAYMENTS (Dedicated Table for SaaS Billing)
create table public.user_payments (
  user_id uuid references public.users on delete cascade primary key,
  razorpay_customer_id text not null,
  razorpay_subscription_id text, -- ID for their Quantra SaaS Monthly Fee
  last_payment_status text check (last_payment_status in ('success', 'failed', 'pending')),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. USER KYC (For Creators and Compliance)
create table public.user_kyc (
  user_id uuid references public.users on delete cascade primary key,
  pan_verified boolean default false,
  sebi_registration_number text, -- E.g. INA000000000 (If they are an RIA)
  is_ria boolean default false,
  razorpay_connect_account_id text, -- Used to route marketplace payouts securely
  kyc_status text check (kyc_status in ('pending', 'approved', 'rejected')) default 'pending',
  verified_at timestamp with time zone
);

-- 3. BROKER CONNECTIONS
create table public.broker_connections (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  broker text check (broker in ('fyers', 'zerodha', 'upstox', 'angelone')) not null,
  client_id text not null,
  api_key text not null,
  api_secret text not null, -- Note: In production, this should be encrypted via Vault
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, broker)
);

-- 4. STRATEGIES (The Algos)
create table public.strategies (
  id uuid default uuid_generate_v4() primary key,
  creator_id uuid references public.users on delete cascade not null,
  name text not null,
  description text,
  logic_graph jsonb not null default '{}'::jsonb, -- ReactFlow nodes/edges
  
  -- Marketplace Settings
  is_public_marketplace boolean default false,
  monthly_fee numeric(10, 2) default 0.00, -- e.g., 5000.00 INR
  status text check (status in ('draft', 'published', 'suspended')) default 'draft',
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. MARKETPLACE SUBSCRIPTIONS (Subscribers buying Creator Algos)
create table public.marketplace_subscriptions (
  id uuid default uuid_generate_v4() primary key,
  subscriber_id uuid references public.users on delete cascade not null,
  strategy_id uuid references public.strategies on delete cascade not null,
  razorpay_subscription_id text, -- Maps to the recurring payment
  status text check (status in ('active', 'canceled', 'past_due')) default 'active',
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(subscriber_id, strategy_id)
);

-- 6. EXECUTION LOGS (For Backtesting & Live Trading History)
create table public.execution_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  strategy_id uuid references public.strategies on delete set null,
  symbol text not null,
  action text check (action in ('BUY', 'SELL')) not null,
  quantity integer not null,
  price numeric(10, 2) not null,
  execution_type text check (execution_type in ('paper', 'live', 'backtest')) not null,
  status text check (status in ('success', 'failed', 'rejected')) not null,
  broker_order_id text,
  trade_time timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Security: Row Level Security (RLS) Policies
alter table public.users enable row level security;
alter table public.user_kyc enable row level security;
alter table public.broker_connections enable row level security;
alter table public.strategies enable row level security;
alter table public.marketplace_subscriptions enable row level security;
alter table public.execution_logs enable row level security;

-- Basic RLS: Users can only see/edit their own data
create policy "Users can view own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

create policy "Users can view own KYC" on public.user_kyc for select using (auth.uid() = user_id);
create policy "Users can view own brokers" on public.broker_connections for select using (auth.uid() = user_id);
create policy "Users can view own execution logs" on public.execution_logs for select using (auth.uid() = user_id);

-- Strategies: Anyone can see public strategies, but only creators can edit them
create policy "Anyone can view public strategies" on public.strategies for select using (is_public_marketplace = true);
create policy "Creators can manage own strategies" on public.strategies for all using (auth.uid() = creator_id);
