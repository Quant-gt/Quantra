export interface BacktestRequest {
  strategy_id: string;
  symbol: string;
  initial_capital: number;
}

export interface TradeLog {
  date: string;
  action: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  pnl?: number;
}

export interface EquityCurvePoint {
  date: string;
  value: number;
}

export interface BacktestResult {
  metrics: {
    total_return_pct: number;
    max_drawdown_pct: number;
    win_rate: number;
    total_trades: number;
    sharpe_ratio: number;
    sortino_ratio: number;
    profit_factor: number;
  };
  trades: TradeLog[];
  equity_curve: EquityCurvePoint[];
}

export async function runBacktest(req: BacktestRequest): Promise<BacktestResult> {
  const apiKey = process.env.ALPHAVANTAGE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing AlphaVantage API Key");
  }

  // 1. Fetch Historical Data from AlphaVantage
  // Format standard exchange symbols to AlphaVantage standard (e.g. RELIANCE or RELIANCE.NS -> RELIANCE.NSE)
  let avSymbol = req.symbol.toUpperCase();
  if (!avSymbol.includes('.')) {
    if (avSymbol !== 'NIFTY' && avSymbol !== 'BANKNIFTY' && avSymbol !== 'SENSEX') {
      avSymbol = `${avSymbol}.NSE`;
    }
  } else if (avSymbol.endsWith('.NS')) {
    avSymbol = avSymbol.replace('.NS', '.NSE');
  }

  // Using TIME_SERIES_DAILY to get roughly the last 100 days by default
  const res = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${avSymbol}&apikey=${apiKey}`);
  const data = await res.json();
  
  if (data['Error Message'] || !data['Time Series (Daily)']) {
    throw new Error(data['Error Message'] || "Failed to fetch AlphaVantage data (rate limit or invalid symbol)");
  }

  const timeSeries = data['Time Series (Daily)'];
  // Sort dates chronologically
  const dates = Object.keys(timeSeries).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  // 2. Initialize Backtest Engine State
  let capital = req.initial_capital;
  let position = 0;
  let entryPrice = 0;
  
  const trades: TradeLog[] = [];
  const equity_curve: EquityCurvePoint[] = [];
  
  let maxCapital = capital;
  let maxDrawdown = 0;
  let winningTrades = 0;

  // 3. Simple Moving Average (SMA) crossover simulation logic for MVP
  // Calculate a mock 5-day SMA and 20-day SMA to trigger trades
  const closePrices = dates.map(d => parseFloat(timeSeries[d]['4. close']));

  for (let i = 20; i < dates.length; i++) {
    const date = dates[i]!;
    const price = closePrices[i]!;
    
    // Calculate SMAs
    const sma5 = closePrices.slice(i - 5, i).reduce((a, b) => a + b, 0) / 5;
    const sma20 = closePrices.slice(i - 20, i).reduce((a, b) => a + b, 0) / 20;
    const prevSma5 = closePrices.slice(i - 6, i - 1).reduce((a, b) => a + b, 0) / 5;
    const prevSma20 = closePrices.slice(i - 21, i - 1).reduce((a, b) => a + b, 0) / 20;

    // BUY SIGNAL: SMA5 crosses above SMA20
    if (position === 0 && sma5 > sma20 && prevSma5 <= prevSma20) {
      const quantity = Math.floor(capital / price);
      if (quantity > 0) {
        position = quantity;
        entryPrice = price;
        capital -= (quantity * price); // Deduct cash
        trades.push({ date, action: 'BUY', price, quantity });
      }
    } 
    // SELL SIGNAL: SMA5 crosses below SMA20 OR end of data
    else if (position > 0 && (sma5 < sma20 && prevSma5 >= prevSma20 || i === dates.length - 1)) {
      const pnl = (price - entryPrice) * position;
      capital += (position * price); // Add cash back
      trades.push({ date, action: 'SELL', price, quantity: position, pnl });
      
      if (pnl > 0) winningTrades++;
      position = 0;
    }

    // Track Equity Curve and Drawdown
    const currentEquity = capital + (position * price);
    equity_curve.push({ date, value: Number(currentEquity.toFixed(2)) });

    if (currentEquity > maxCapital) {
      maxCapital = currentEquity;
    } else {
      const drawdown = (maxCapital - currentEquity) / maxCapital;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    }
  }

  // 4. Calculate Metrics
  const totalReturn = ((capital - req.initial_capital) / req.initial_capital) * 100;
  const totalTrades = trades.filter(t => t.action === 'SELL').length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  
  // Approximate Sharpe (Assume risk-free rate = 0, using simple return standard deviation)
  const returns = equity_curve.map((v, i) => i > 0 ? (v.value - equity_curve[i-1]!.value) / equity_curve[i-1]!.value : 0).slice(1);
  const avgReturn = returns.reduce((a, b) => a + b, 0) / (returns.length || 1);
  const stdDev = Math.sqrt(returns.reduce((sq, val) => sq + Math.pow(val - avgReturn, 2), 0) / (returns.length || 1));
  const sharpeRatio = stdDev === 0 ? 0 : (avgReturn / stdDev) * Math.sqrt(252); // Annualized

  // Calculate Profit Factor
  let grossProfits = 0;
  let grossLosses = 0;
  trades.forEach(t => {
    if (t.action === 'SELL' && t.pnl !== undefined) {
      if (t.pnl > 0) grossProfits += t.pnl;
      else if (t.pnl < 0) grossLosses += Math.abs(t.pnl);
    }
  });
  let profitFactor = 0;
  if (grossLosses === 0) {
    profitFactor = grossProfits > 0 ? 99.9 : 0.0;
  } else {
    profitFactor = Number((grossProfits / grossLosses).toFixed(2));
  }

  // Calculate Sortino Ratio
  const downsideReturns = returns.map(r => r < 0 ? r : 0);
  const downsideDev = Math.sqrt(downsideReturns.reduce((sq, val) => sq + Math.pow(val, 2), 0) / (downsideReturns.length || 1));
  const sortinoRatio = downsideDev === 0 ? 0 : (avgReturn / downsideDev) * Math.sqrt(252);

  return {
    metrics: {
      total_return_pct: Number(totalReturn.toFixed(2)),
      max_drawdown_pct: Number((maxDrawdown * 100).toFixed(2)),
      win_rate: Number(winRate.toFixed(2)),
      total_trades: totalTrades,
      sharpe_ratio: Number(sharpeRatio.toFixed(2)),
      sortino_ratio: Number(sortinoRatio.toFixed(2)),
      profit_factor: profitFactor
    },
    trades,
    equity_curve
  };
}
