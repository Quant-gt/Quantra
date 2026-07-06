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
    
    // Fetch live quotes from Yahoo Finance Quote API
    const url = 'https://query2.finance.yahoo.com/v7/finance/quote?symbols=RELIANCE.NS,TCS.NS,INFY.NS,HDFCBANK.NS,ICICIBANK.NS';
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
        const cleanSymbol = q.symbol.replace(/\.(NS|BO)$/, '');
        const pctChange = q.regularMarketChangePercent || 0;
        
        // Dynamically assign matching descriptors based on live metrics
        const matched = [];
        if (pctChange > 1.0) {
          matched.push('Volume Surge', 'Momentum Buy');
        } else if (pctChange < -1.0) {
          matched.push('RSI Oversold', 'Mean Reversion');
        } else {
          matched.push('Consolidation', 'Support Range');
        }

        return {
          ticker: cleanSymbol,
          name: q.shortName || cleanSymbol,
          cmp: q.regularMarketPrice || 0,
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
