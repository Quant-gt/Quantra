-- 7. USER PORTFOLIO RISK SETTINGS
create table public.user_portfolio_risk (
  user_id uuid references public.users on delete cascade primary key,
  max_daily_drawdown_limit numeric(10, 2) default -5000.00, -- Maximum loss per day across all algos
  trailing_stop_loss_pct numeric(5, 2) default 0.00, -- 0.00 means disabled
  position_sizing_model text check (position_sizing_model in ('fixed', 'kelly_criterion', 'risk_parity')) default 'fixed',
  max_open_positions integer default 10,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- We also need a way to track today's PnL. For simplicity, we can add it to the user's main record or a portfolio_stats table.
-- Let's add it to user_portfolio_risk for this sprint as a cached value updated by a cron job or webhook
alter table public.user_portfolio_risk
add column today_unrealised_pnl numeric(10, 2) default 0.00,
add column today_realised_pnl numeric(10, 2) default 0.00;

-- Enable RLS
alter table public.user_portfolio_risk enable row level security;
create policy "Users can view own risk settings" on public.user_portfolio_risk for select using (auth.uid() = user_id);
create policy "Users can update own risk settings" on public.user_portfolio_risk for update using (auth.uid() = user_id);
create policy "Users can insert own risk settings" on public.user_portfolio_risk for insert with check (auth.uid() = user_id);
