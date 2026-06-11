-- 1. Create strategy_positions to track what each strategy holds
CREATE TABLE public.strategy_positions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    strategy_id uuid REFERENCES public.strategies ON DELETE CASCADE,
    symbol text NOT NULL,
    quantity integer NOT NULL DEFAULT 0,
    average_price numeric(10, 2) NOT NULL DEFAULT 0.00,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(strategy_id, symbol)
);

-- 2. Create master_execution_log to audit the real Fyers orders
CREATE TABLE public.master_execution_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    fyers_order_id text, -- ID returned by the broker
    symbol text NOT NULL,
    order_type text CHECK (order_type IN ('BUY', 'SELL')) NOT NULL,
    quantity integer NOT NULL,
    price numeric(10, 2), -- Null if Market order
    status text DEFAULT 'PENDING',
    executed_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    strategy_allocations jsonb -- Records which strategies contributed to this order
);

-- Enable RLS
ALTER TABLE public.strategy_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_execution_log ENABLE ROW LEVEL SECURITY;

-- Admins and system processes can read/write. For now, we will just allow authenticated reads since the AI engine bypasses RLS via Service Role Key.
CREATE POLICY "Public read strategy positions" ON public.strategy_positions FOR SELECT USING (true);
CREATE POLICY "Public read execution logs" ON public.master_execution_log FOR SELECT USING (true);
