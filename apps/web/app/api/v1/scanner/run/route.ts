import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { scanner_config_id, filter_graph } = await request.json();
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Simulate scanning Nifty 500
    // In real app, this would query Upstash Redis for cached indicators/prices
    // and evaluate the filter_graph
    
    const mockStocks = [
      { ticker: 'RELIANCE', name: 'Reliance Industries', cmp: 2950.50, change: 1.5, matched: ['RSI Oversold', 'Volume Surge'] },
      { ticker: 'INFY', name: 'Infosys Ltd', cmp: 1420.00, change: -0.5, matched: ['Golden Cross'] },
      { ticker: 'HDFCBANK', name: 'HDFC Bank', cmp: 1510.25, change: 0.8, matched: ['Support Level'] },
      { ticker: 'TCS', name: 'Tata Consultancy Services', cmp: 3850.00, change: 2.1, matched: ['MACD Bullish'] },
      { ticker: 'ICICIBANK', name: 'ICICI Bank', cmp: 1080.50, change: 1.2, matched: ['Supertrend Buy'] }
    ];

    // Save results to history
    if (scanner_config_id) {
      await supabase
        .from('scan_results')
        .insert({
          scanner_config_id,
          results: mockStocks
        });
    }

    return NextResponse.json({ success: true, results: mockStocks });

  } catch (error: any) {
    console.error('Scanner Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
