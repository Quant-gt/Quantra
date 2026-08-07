import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { strategy_id, symbol, initial_capital, start_date, end_date, strategy_logic } = body;
    const authHeader = request.headers.get('authorization');

    // Validate inputs
    if (typeof initial_capital !== 'number' || initial_capital <= 0) {
      return NextResponse.json({ success: false, error: 'initial_capital must be a positive number' }, { status: 400 });
    }
    if (!symbol) {
      return NextResponse.json({ success: false, error: 'symbol is required' }, { status: 400 });
    }

    const executionUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';

    try {
      // Attempt proxying to the NLP backend
      const res = await fetch(`${executionUrl}/api/backtest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { 'Authorization': authHeader } : {})
        },
        body: JSON.stringify({ 
          symbol, 
          start_date: start_date || '2023-01-01', 
          end_date: end_date || '2023-12-31',
          strategy_logic 
        }),
        // Set a short timeout so we fallback quickly if offline
        signal: AbortSignal.timeout(15000)
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({ success: true, ...data });
      } else {
        const errText = await res.text();
        return NextResponse.json({ success: false, error: errText || 'Backtest execution failed' }, { status: res.status });
      }
    } catch (proxyError: any) {
      console.error('Execution service proxy backtest failed:', proxyError);
      return NextResponse.json({ 
        success: false, 
        error: `Execution Service Offline: ${proxyError.message || 'Connection refused'}` 
      }, { status: 502 });
    }
  } catch (error: any) {
    console.error('Backtest route handler error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Engine failure' }, { status: 500 });
  }
}
