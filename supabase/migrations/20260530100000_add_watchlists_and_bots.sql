-- Add User Watchlists Table
create table if not exists public.user_watchlists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  symbol text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, symbol)
);

-- Add Deployed Bots Table
create table if not exists public.deployed_bots (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  strategy_id uuid references public.strategies(id) on delete set null,
  name text not null,
  target_symbol text not null,
  status text check (status in ('ACTIVE', 'PAUSED')) default 'ACTIVE',
  pnl text default '0.00',
  roi text default '0.0%',
  uptime text default '0m',
  latency text default '--',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_watchlists enable row level security;
alter table public.deployed_bots enable row level security;

-- Add RLS Policies
create policy "Users can view own watchlist" on public.user_watchlists for select using (auth.uid() = user_id);
create policy "Users can insert into own watchlist" on public.user_watchlists for insert with check (auth.uid() = user_id);
create policy "Users can delete from own watchlist" on public.user_watchlists for delete using (auth.uid() = user_id);

create policy "Users can view own bots" on public.deployed_bots for select using (auth.uid() = user_id);
create policy "Users can insert own bots" on public.deployed_bots for insert with check (auth.uid() = user_id);
create policy "Users can update own bots" on public.deployed_bots for update using (auth.uid() = user_id);
create policy "Users can delete own bots" on public.deployed_bots for delete using (auth.uid() = user_id);
