import { NextResponse } from 'next/server';

function normalizeSymbol(ticker: string, exchange: "NSE" | "BSE") {
  const clean = ticker.toUpperCase().replace(/\.NS$/, '').replace(/\.BO$/, '').trim();
  const suffix = exchange === 'BSE' ? '.BO' : '.NS';
  return `${clean}${suffix}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');
    const exchange = (searchParams.get('exchange') || 'NSE') as 'NSE' | 'BSE';

    if (!ticker) {
      return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
    }

    const yahooSymbol = normalizeSymbol(ticker, exchange);
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?range=1y&interval=1d`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error(`Yahoo chart API returned status: ${response.status}`);
    }

    const data = await response.json();
    const result = data.chart?.result?.[0];
    if (!result) {
      return NextResponse.json({ success: true, data: [] });
    }

    const timestamps = result.timestamp || [];
    const quote = result.indicators?.quote?.[0];
    if (!quote || timestamps.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const candles = [];
    for (let i = 0; i < timestamps.length; i++) {
      const close = quote.close?.[i];
      const open = quote.open?.[i];
      const high = quote.high?.[i];
      const low = quote.low?.[i];
      const volume = quote.volume?.[i];
      const timeSec = timestamps[i];

      if (
        close !== null && open !== null && high !== null && low !== null && volume !== null &&
        close !== undefined && open !== undefined && high !== undefined && low !== undefined && volume !== undefined
      ) {
        const date = new Date(timeSec * 1000);
        const time = date.toISOString().split('T')[0]!;
        candles.push({ time, open, high, low, close, volume });
      }
    }

    candles.sort((a, b) => a.time.localeCompare(b.time));
    const limitedCandles = candles.slice(-180);

    return NextResponse.json({ success: true, data: limitedCandles });
  } catch (error: any) {
    console.error("Market history fetch error:", error);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
