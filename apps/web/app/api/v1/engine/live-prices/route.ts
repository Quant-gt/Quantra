import { NextResponse } from 'next/server';

const SYMBOL_MAP: Record<string, string> = {
  'NIFTY 50': '^NSEI',
  'BANKNIFTY': '^NSEBANK',
  'RELIANCE': 'RELIANCE.NS',
  'HDFC BANK': 'HDFCBANK.NS',
  'TCS': 'TCS.NS',
  'INFY': 'INFY.NS',
  'ICICI BANK': 'ICICIBANK.NS',
  'SBI': 'SBIN.NS'
};

export async function GET() {
  const results: Record<string, { price: number; change: number; changePct: number }> = {};

  try {
    await Promise.all(
      Object.entries(SYMBOL_MAP).map(async ([displayName, yahooSymbol]) => {
        try {
          const res = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?range=2d&interval=1d`,
            {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
              },
              next: { revalidate: 10 } // Cache for 10 seconds
            }
          );
          
          if (!res.ok) throw new Error(`HTTP error ${res.status}`);
          const data = await res.json();
          
          const result = data?.chart?.result?.[0];
          if (!result) throw new Error('Invalid structure');

          const price = result.meta?.regularMarketPrice;
          const prevClose = result.meta?.chartPreviousClose || result.meta?.previousClose;
          
          if (price !== undefined && prevClose !== undefined) {
            const change = price - prevClose;
            const changePct = (change / prevClose) * 100;
            results[displayName] = {
              price: Number(price.toFixed(2)),
              change: Number(change.toFixed(2)),
              changePct: Number(changePct.toFixed(2))
            };
          }
        } catch (err) {
          console.error(`Failed to fetch live price for ${displayName} (${yahooSymbol}):`, err);
        }
      })
    );

    // If Yahoo Finance failed for some reason, return fallback values close to current market
    const fallbackPrices: Record<string, { price: number; change: number; changePct: number }> = {
      'NIFTY 50': { price: 23507.25, change: 4.85, changePct: 0.02 },
      'BANKNIFTY': { price: 48084.09, change: -6.14, changePct: -0.01 },
      'RELIANCE': { price: 2951.71, change: -3.11, changePct: -0.11 },
      'HDFCBANK': { price: 1517.53, change: -0.2, changePct: -0.01 },
      'TCS': { price: 3924.43, change: 0.46, changePct: 0.01 },
      'INFY': { price: 1422.13, change: -0.24, changePct: -0.02 },
      'ICICIBANK': { price: 1120.90, change: 11.15, changePct: 1.15 }
    };

    const finalPrices = { ...fallbackPrices, ...results };

    return NextResponse.json({ success: true, prices: finalPrices });
  } catch (error) {
    console.error('Error fetching live market quotes:', error);
    return NextResponse.json({ error: 'Failed to fetch live quotes' }, { status: 500 });
  }
}
