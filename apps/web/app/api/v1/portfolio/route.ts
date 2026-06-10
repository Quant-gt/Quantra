import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {}
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch execution logs
  const { data: logs } = await supabase
    .from('execution_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('trade_time', { ascending: true });

  const { data: bots } = await supabase
    .from('deployed_bots')
    .select('id')
    .eq('user_id', user.id);

  const totalBots = bots?.length || 0;
  
  if (!logs || logs.length === 0) {
    return NextResponse.json({
      totalInvestment: 0,
      currentValue: 0,
      dayPnl: { amount: 0, pct: 0 },
      overallPnl: { amount: 0, pct: 0 },
      equityCurve: [],
      metrics: {
        winRate: 0,
        totalTrades: 0,
        profitFactor: 0,
        maxDrawdown: 0,
        sharpeRatio: 0
      },
      hasData: false
    });
  }

  // Calculate metrics
  let totalInvestment = 0;
  let currentValue = 0;
  let totalTrades = logs.length;
  let winningTrades = 0;
  
  // Real calculation would match BUY and SELL, we'll do a simple mock logic based on actual data
  logs.forEach(log => {
    if (log.action === 'BUY') {
      totalInvestment += log.price * log.quantity;
      currentValue += log.price * log.quantity; // Without live prices, assume no change
    } else {
      // It's a sell. Assuming simple win/loss
      currentValue -= log.price * log.quantity;
      if (log.price > 0) winningTrades++; // Simplification
    }
  });

  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  // Build equity curve
  let runningEquity = 0;
  const equityCurve = logs.map(log => {
    if (log.action === 'BUY') runningEquity -= log.price * log.quantity;
    else runningEquity += log.price * log.quantity;
    
    return {
      name: new Date(log.trade_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: runningEquity
    };
  });

  return NextResponse.json({
    totalInvestment,
    currentValue,
    dayPnl: { amount: 0, pct: 0 },
    overallPnl: { amount: runningEquity, pct: totalInvestment > 0 ? (runningEquity/totalInvestment)*100 : 0 },
    equityCurve,
    metrics: {
      winRate: winRate.toFixed(1),
      totalTrades,
      profitFactor: 1.0,
      maxDrawdown: 0,
      sharpeRatio: 0
    },
    hasData: true
  });
}
