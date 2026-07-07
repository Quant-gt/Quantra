import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { symbols } = await request.json();
    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json({ error: 'Invalid symbols parameter' }, { status: 400 });
    }
    
    // Append .NS suffix for Indian NSE symbols
    const yahooSymbols = symbols.map(s => `${s}.NS`).join(',');
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${yahooSymbols}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      next: { revalidate: 15 } // Cache for 15s
    });
    
    if (!response.ok) {
      throw new Error(`Yahoo API returned status: ${response.status}`);
    }
    
    const data = await response.json();
    const quotes = data.quoteResponse?.result || [];
    
    // Map quotes back to symbol name
    const quotesMap: { [key: string]: any } = {};
    quotes.forEach((q: any) => {
      const cleanSymbol = q.symbol.replace(/\.NS$/, '');
      quotesMap[cleanSymbol] = {
        close: q.regularMarketPrice || 0,
        open: q.regularMarketOpen || q.regularMarketPrice || 0,
        high: q.regularMarketDayHigh || q.regularMarketPrice || 0,
        low: q.regularMarketDayLow || q.regularMarketPrice || 0,
        volume: q.regularMarketVolume || 0,
        change: q.regularMarketChangePercent || 0,
      };
    });
    
    return NextResponse.json({ quotes: quotesMap });
  } catch (error: any) {
    console.error("Live quotes fetching error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
