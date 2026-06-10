-- Migration: add_backtests_and_scans

CREATE TABLE public.backtest_runs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    strategy_id UUID REFERENCES public.strategies(id) ON DELETE CASCADE,
    asset_symbol TEXT NOT NULL,
    timeframe TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    cagr DECIMAL(10,2),
    max_drawdown DECIMAL(10,2),
    win_rate DECIMAL(5,2),
    sharpe_ratio DECIMAL(5,2),
    total_trades INT,
    equity_curve JSONB, -- Stores the timeseries data for the chart
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.saved_scans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    scan_name TEXT NOT NULL,
    criteria JSONB NOT NULL,
    results JSONB, -- Stores the snapshot of symbols that matched the scan
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS policies
ALTER TABLE public.backtest_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own backtests" ON public.backtest_runs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own backtests" ON public.backtest_runs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own backtests" ON public.backtest_runs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own scans" ON public.saved_scans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own scans" ON public.saved_scans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own scans" ON public.saved_scans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own scans" ON public.saved_scans FOR DELETE USING (auth.uid() = user_id);
