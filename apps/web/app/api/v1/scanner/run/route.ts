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
    
    // Use the comprehensive quotes API which calculates real TA
    const symbols = [
      'RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 
      'SBIN', 'BHARTIARTL', 'ITC', 'HINDUNILVR', 'AXISBANK', 
      'KOTAKBANK', 'LT', 'BAJFINANCE', 'MARUTI', 'TITAN', 
      'SUNPHARMA', 'ULTRACEMCO', 'TATAMOTORS', 'NTPC', 'POWERGRID'
    ];
    
    const quotesUrl = new URL('/api/v1/market/quotes', request.url);
    const response = await fetch(quotesUrl.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbols })
    });

    let liveStocks: any[] = [];
    if (response.ok) {
      const data = await response.json();
      const quotes = data.quotes || {};
      
      liveStocks = Object.keys(quotes).map(symbol => {
        const q = quotes[symbol];
        const matched = [];
        
        if (q.rsi < 35) {
          matched.push('RSI Oversold', 'Mean Reversion');
        } else if (q.rsi > 65) {
          matched.push('RSI Overbought', 'Trend Reversal');
        }
        
        if (q.hasVolumeSurge) {
          matched.push('Volume Surge', 'Momentum Buy');
        }
        
        if (q.hasGoldenCross) {
          matched.push('Golden Cross', 'Bullish Trend');
        }
        
        if (q.hasMacd) {
          matched.push('MACD Crossover', 'Momentum Shift');
        }
        
        if (matched.length === 0) {
          matched.push('Consolidation', 'Support Range');
        }

        return {
          ticker: symbol,
          name: symbol,
          cmp: q.close,
          change: q.change,
          matched
        };
      });
    } else {
      throw new Error(`Failed to fetch live quotes. Internal API responded with status: ${response.status}`);
    }

    // Save results to history
    if (scanner_config_id) {
      await supabase
        .from('scan_results')
        .insert({
          scanner_config_id,
          results: liveStocks
        });
    }

    return NextResponse.json({ success: true, results: liveStocks });

  } catch (error: any) {
    console.error('Scanner Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
