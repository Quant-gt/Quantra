import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const symbols = ['^NSEI', '^BSESN', 'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS'];
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols.join(',')}`;
    
    const response = await fetch(url, { 
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      next: { revalidate: 60 } 
    }); // Cache for 60s
    if (!response.ok) throw new Error('Failed to fetch from Yahoo Finance');
    
    const data = await response.json();
    const results = data.quoteResponse?.result || [];
    
    const formatted = results.map((q: any) => {
      let name = q.shortName || q.symbol;
      if (q.symbol === '^NSEI') name = 'NIFTY 50';
      if (q.symbol === '^BSESN') name = 'SENSEX';
      if (q.symbol === 'RELIANCE.NS') name = 'RELIANCE';
      if (q.symbol === 'TCS.NS') name = 'TCS';
      if (q.symbol === 'HDFCBANK.NS') name = 'HDFCBANK';

      const changePct = q.regularMarketChangePercent || 0;
      return {
        name,
        price: (q.regularMarketPrice || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 }),
        change: `${changePct >= 0 ? '+' : ''}${changePct.toFixed(2)}%`,
        up: changePct >= 0
      };
    });

    return NextResponse.json({ stocks: formatted });
  } catch (error) {
    // If Yahoo blocks the request, return an empty array instead of fake static data
    console.error("Market Ticker Fallback Error:", error);
    return NextResponse.json({ stocks: [] });
  }
}
