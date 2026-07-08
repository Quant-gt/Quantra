import { NextResponse } from 'next/server';

function normalizeSymbol(ticker: string, exchange: "NSE" | "BSE") {
  const clean = ticker.toUpperCase().replace(/\.NS$/, '').replace(/\.BO$/, '').trim();
  
  if (!/^[A-Z0-9.-]{1,20}$/.test(clean)) {
    throw new Error('Invalid ticker format');
  }

  const suffix = exchange === 'BSE' ? '.BO' : '.NS';
  return `${clean}${suffix}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');
    const exchangeParam = searchParams.get('exchange') || 'NSE';

    if (!ticker) {
      return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
    }

    if (exchangeParam !== 'NSE' && exchangeParam !== 'BSE') {
      return NextResponse.json({ error: 'Invalid exchange' }, { status: 400 });
    }

    const exchange = exchangeParam as 'NSE' | 'BSE';

    let yahooSymbol: string;
    try {
      yahooSymbol = normalizeSymbol(ticker, exchange);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    const targetUrl = new URL(
      `/v8/finance/chart/${encodeURIComponent(yahooSymbol)}`,
      'https://query1.finance.yahoo.com'
    );
    targetUrl.searchParams.set('range', '1y');
    targetUrl.searchParams.set('interval', '1d');

    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Yahoo chart API returned status: ${response.status}` }, { status: 400 });
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
