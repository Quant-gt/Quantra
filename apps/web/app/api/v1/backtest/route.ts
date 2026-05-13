import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { strategy_id, symbol, start_date, end_date } = await request.json();
    
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Create pending record in DB
    const { data: backtestRecord, error: dbError } = await supabase
      .from('backtest_results')
      .insert({
        strategy_id,
        user_id: user.id,
        status: 'running',
        date_range: { start: start_date, end: end_date },
        parameters: { symbol }
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // 2. Call Python Backtest Service
    const nlpUrl = process.env.NLP_SERVICE_URL || 'http://localhost:3002';
    
    try {
      const response = await fetch(`${nlpUrl}/api/backtest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol,
          start_date,
          end_date,
          strategy_logic: {} // In real app, fetch from strategies.logic_graph
        }),
      });

      if (!response.ok) throw new Error('Backtest service failed');
      const results = await response.json();

      // 3. Update DB with results
      await supabase
        .from('backtest_results')
        .update({
          status: 'completed',
          metrics: results.metrics,
          equity_curve: results.equity_curve,
          trade_log: results.trade_log
        })
        .eq('id', backtestRecord.id);

      return NextResponse.json({ success: true, backtest_id: backtestRecord.id, results });

    } catch (error: any) {
      // Update DB with failure
      await supabase
        .from('backtest_results')
        .update({ status: 'failed' })
        .eq('id', backtestRecord.id);
        
      throw error;
    }

  } catch (error: any) {
    console.error('Backtest Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
