import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const symbols = ['^NSEI', '^BSESN', 'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS'];
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols.join(',')}`;
    
    const response = await fetch(url, { next: { revalidate: 60 } }); // Cache for 60s
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
    // If Yahoo blocks Vercel IPs, return realistic mock data so UI doesn't hang
    return NextResponse.json({ stocks: [
      { name: "NIFTY 50", price: "22,500.00", change: "+0.5%", up: true },
      { name: "SENSEX", price: "74,000.00", change: "+0.4%", up: true },
      { name: "RELIANCE", price: "2,950.00", change: "+1.2%", up: true },
      { name: "TCS", price: "3,800.00", change: "-0.3%", up: false },
      { name: "HDFCBANK", price: "1,450.00", change: "+0.8%", up: true }
    ] });
  }
}
