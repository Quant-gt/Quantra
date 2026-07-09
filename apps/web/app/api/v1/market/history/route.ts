import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol");
    const resolution = searchParams.get("resolution");
    const range_from = searchParams.get("range_from");
    
    if (!symbol || !resolution || !range_from) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Map to Yahoo Finance symbol
    let yahoo_sym = symbol;
    if (!symbol.includes(".")) {
      yahoo_sym = `${symbol}.NS`;
    }

    // Map resolution to Yahoo interval
    let interval = "1d";
    if (resolution === "1") interval = "1m";
    else if (resolution === "5") interval = "5m";
    else if (resolution === "15") interval = "15m";
    else if (resolution === "30") interval = "30m";
    else if (resolution === "60") interval = "1h";
    else if (resolution === "D") interval = "1d";
    else if (resolution === "W") interval = "1wk";

    // Convert dates to UNIX timestamps (seconds)
    const p1 = Math.floor(new Date(range_from).getTime() / 1000);
    const p2 = Math.floor(Date.now() / 1000); // Current time for latest intraday

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahoo_sym}?period1=${p1}&period2=${p2}&interval=${interval}`;
    
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Broker API Error: ${response.statusText}` }, { status: response.status });
    }

    const chartData = await response.json();
    const result = chartData?.chart?.result?.[0];
    
    if (!result) {
      return NextResponse.json({ candles: [] });
    }

    const timestamps = result.timestamp || [];
    const quote = result.indicators?.quote?.[0] || {};
    const { open = [], high = [], low = [], close = [], volume = [] } = quote;

    const candles = [];
    for (let i = 0; i < timestamps.length; i++) {
      if (open[i] !== null && high[i] !== null && low[i] !== null && close[i] !== null) {
        candles.push({
          time: timestamps[i],
          open: open[i],
          high: high[i],
          low: low[i],
          close: close[i],
          volume: volume[i] || 0
        });
      }
    }

    return NextResponse.json({ candles, source: "yahoo" });
  } catch (error: any) {
    console.error("Market History Route Error:", error);
    return NextResponse.json(
      { error: "Failed to stream data from market gateway." },
      { status: 500 }
    );
  }
}
