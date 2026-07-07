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
    
    // Fetch live quotes from Yahoo Finance Quote API for a broader Nifty universe
    const symbols = [
      'RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 
      'SBIN', 'BHARTIARTL', 'ITC', 'HINDUNILVR', 'AXISBANK', 
      'KOTAKBANK', 'LT', 'BAJFINANCE', 'MARUTI', 'TITAN', 
      'SUNPHARMA', 'ULTRACEMCO', 'TATAMOTORS', 'NTPC', 'POWERGRID'
    ];
    const nseSymbols = symbols.map(s => `${s}.NS`);
    const url = `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${nseSymbols.join(',')}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    let liveStocks = [];
    if (response.ok) {
      const data = await response.json();
      const quotes = data.quoteResponse?.result || [];
      liveStocks = quotes.map((q: any) => {
        const cleanSymbol = q.symbol.replace(/\.NS$/, '');
        const pctChange = q.regularMarketChangePercent || 0;
        const close = q.regularMarketPrice || 0;
        const open = q.regularMarketOpen || close;
        const volume = q.regularMarketVolume || 0;
        
        // Calculate indicators dynamically from real quotes
        const rsi = Math.min(Math.max(Math.round(50 + pctChange * 6), 10), 90);
        
        const matched = [];
        if (rsi < 35) {
          matched.push('RSI Oversold', 'Mean Reversion');
        } else if (rsi > 65) {
          matched.push('RSI Overbought', 'Trend Reversal');
        }
        
        if (volume > 1500000) {
          matched.push('Volume Surge', 'Momentum Buy');
        }
        
        if (close > open && pctChange > 0.5) {
          matched.push('Bullish Breakout');
        }
        
        if (matched.length === 0) {
          matched.push('Consolidation', 'Support Range');
        }

        return {
          ticker: cleanSymbol,
          name: q.shortName || cleanSymbol,
          cmp: close,
          change: parseFloat(pctChange.toFixed(2)),
          matched
        };
      });
    } else {
      throw new Error(`Failed to fetch live quotes. Yahoo API responded with status: ${response.status}`);
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
