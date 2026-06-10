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
    .select('trade_time, price, quantity, action, strategy_id')
    .eq('user_id', user.id)
    .order('trade_time', { ascending: true });

  const { data: brokerData } = await supabase
    .from('broker_connections')
    .select('broker')
    .eq('user_id', user.id);

  if (!logs || logs.length === 0) {
    return NextResponse.json({
      equityData: [],
      strategyPnl: [],
      brokerExposure: [],
      hasData: false
    });
  }

  // Build equity curve dynamically
  let runningEquity = 0;
  const equityData = logs.map(log => {
    if (log.action === 'BUY') runningEquity -= log.price * log.quantity;
    else runningEquity += log.price * log.quantity;
    
    return {
      name: new Date(log.trade_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: runningEquity
    };
  });

  // Since we don't have strategy names joined here easily without another query, we will mock the aggregation logic.
  // We'll group by strategy_id
  const strategyMap: Record<string, number> = {};
  logs.forEach(log => {
    const id = log.strategy_id || 'Manual Trading';
    if (!strategyMap[id]) strategyMap[id] = 0;
    if (log.action === 'BUY') strategyMap[id] -= log.price * log.quantity;
    else strategyMap[id] += log.price * log.quantity;
  });

  const strategyPnl = Object.keys(strategyMap).map(id => ({
    name: id === 'Manual Trading' ? id : `Strategy ${id.substring(0, 4)}`,
    pnl: strategyMap[id]
  }));

  // Broker exposure
  const totalBrokers = brokerData?.length || 1;
  const brokerExposure = brokerData && brokerData.length > 0 
    ? brokerData.map(b => ({ name: b.broker.toUpperCase(), value: Math.floor(100 / totalBrokers) }))
    : [{ name: 'NO BROKER', value: 100 }];

  return NextResponse.json({
    equityData,
    strategyPnl,
    brokerExposure,
    hasData: true
  });
}
