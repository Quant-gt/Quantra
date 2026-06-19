import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { strategy_id, symbol, initial_capital } = body;

    // Validate inputs
    if (typeof initial_capital !== 'number' || initial_capital <= 0) {
      return NextResponse.json({ success: false, error: 'initial_capital must be a positive number' }, { status: 400 });
    }
    if (!strategy_id || !symbol) {
      return NextResponse.json({ success: false, error: 'strategy_id and symbol are required' }, { status: 400 });
    }

    // Simulate engine processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock equity curve
    const equity_curve = [];
    let currentVal = initial_capital;
    for (let i = 0; i < 30; i++) {
      const date = new Date(Date.now() - (30 - i) * 86400000).toISOString().split('T')[0];
      // Simulate random daily walk with upward drift
      const change = currentVal * (0.005 + (Math.random() * 0.02 - 0.01));
      currentVal += change;
      equity_curve.push({ date, value: Math.round(currentVal) });
    }

    // Generate mock trades
    const trades = [
      { date: '2026-05-18', action: 'BUY', price: 150.25, quantity: 100, pnl: null },
      { date: '2026-05-19', action: 'SELL', price: 155.50, quantity: 100, pnl: 525.00 },
      { date: '2026-05-20', action: 'BUY', price: 154.00, quantity: 100, pnl: null },
      { date: '2026-05-21', action: 'SELL', price: 152.00, quantity: 100, pnl: -200.00 },
    ];

    // Comprehensive institutional metrics
    const metrics = {
      total_return_pct: 14.5,
      win_rate: 68.2,
      max_drawdown_pct: 8.4,
      sharpe_ratio: 2.1,
      sortino_ratio: 2.8,       // NEW: Downside risk adjusted return
      profit_factor: 1.95       // NEW: Gross profit / Gross loss
    };

    return NextResponse.json({
      success: true,
      strategy_id,
      symbol,
      metrics,
      equity_curve,
      trades
    });
  } catch (error) {
    console.error('Backtest error:', error);
    return NextResponse.json({ success: false, error: 'Engine failure' }, { status: 500 });
  }
}
