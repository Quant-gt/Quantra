import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: 'Query parameter q is required' }, { status: 400 });
  }

  try {
    const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=15&country=IN`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Yahoo API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Filter out only equities and sort
    const quotes = (data.quotes || [])
      .filter((q: any) => q.quoteType === 'EQUITY' || q.quoteType === 'ETF' || q.quoteType === 'INDEX')
      .map((q: any) => {
        // Strip .NS or .BO suffix for the main symbol name so it looks clean like "SUZLON"
        const cleanSymbol = q.symbol.replace(/\.(NS|BO)$/, '');
        return {
          symbol: cleanSymbol,
          exchangeSymbol: q.symbol, // the actual symbol Yahoo uses
          name: q.shortname || q.longname || cleanSymbol,
          exchange: q.exchange,
          type: q.quoteType
        };
      });

    return NextResponse.json({ results: quotes });
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
  }
}
