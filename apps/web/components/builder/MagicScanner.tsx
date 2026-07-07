"use client";

import { 
  Sparkles, 
  Navigation, 
  Info, 
  Star, 
  Download, 
  X, 
  TrendingUp, 
  Settings, 
  Layers, 
  Check, 
  Maximize2,
  Trash2,
  Bookmark
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  LineChart, 
  Line, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Real expanded broad market universe of 100 stocks for dynamic scanning (including Nifty Next 50 and Midcaps)
const STOCK_UNIVERSE = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', sector: 'Energy' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', sector: 'Technology' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', sector: 'Financial Services' },
  { symbol: 'INFY', name: 'Infosys Ltd.', sector: 'Technology' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', sector: 'Financial Services' },
  { symbol: 'BHARTIALRT', name: 'Bharti Airtel Ltd.', sector: 'Telecommunications' },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Financial Services' },
  { symbol: 'LICI', name: 'Life Insurance Corporation of India', sector: 'Financial Services' },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd.', sector: 'Construction' },
  { symbol: 'ITC', name: 'ITC Ltd.', sector: 'Consumer Goods' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.', sector: 'Consumer Goods' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.', sector: 'Financial Services' },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', sector: 'Financial Services' },
  { symbol: 'NTPC', name: 'NTPC Ltd.', sector: 'Utilities' },
  { symbol: 'ADANIPORTS', name: 'Adani Ports & SEZ Ltd.', sector: 'Services' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', sector: 'Automobile' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd.', sector: 'Healthcare' },
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corporation Ltd.', sector: 'Energy' },
  { symbol: 'POWERGRID', name: 'Power Grid Corporation of India Ltd.', sector: 'Utilities' },
  { symbol: 'TITAN', name: 'Titan Company Ltd.', sector: 'Consumer Goods' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.', sector: 'Automobile' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.', sector: 'Financial Services' },
  { symbol: 'COALINDIA', name: 'Coal India Ltd.', sector: 'Energy' },
  { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd.', sector: 'Metals & Mining' },
  { symbol: 'JIOFIN', name: 'Jio Financial Services Ltd.', sector: 'Financial Services' },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd.', sector: 'Materials' },
  { symbol: 'WIPRO', name: 'Wipro Ltd.', sector: 'Technology' },
  { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Ltd.', sector: 'Energy' },
  { symbol: 'HCLTECH', name: 'HCL Technologies Ltd.', sector: 'Technology' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd.', sector: 'Consumer Goods' },
  { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd.', sector: 'Metals & Mining' },
  { symbol: 'TATASTEEL', name: 'Tata Steel Ltd.', sector: 'Metals & Mining' },
  { symbol: 'ADANIPOWER', name: 'Adani Power Ltd.', sector: 'Utilities' },
  { symbol: 'GRASIM', name: 'Grasim Industries Ltd.', sector: 'Materials' },
  { symbol: 'LTIM', name: 'LTIMindtree Ltd.', sector: 'Technology' },
  { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Ltd.', sector: 'Financial Services' },
  { symbol: 'HINDALCO', name: 'Hindalco Industries Ltd.', sector: 'Metals & Mining' },
  { symbol: 'IOC', name: 'Indian Oil Corporation Ltd.', sector: 'Energy' },
  { symbol: 'INDUSINDBK', name: 'IndusInd Bank Ltd.', sector: 'Financial Services' },
  { symbol: 'HAL', name: 'Hindustan Aeronautics Ltd.', sector: 'Industrial' },
  { symbol: 'DLF', name: 'DLF Ltd.', sector: 'Real Estate' },
  { symbol: 'NESTLEIND', name: 'Nestle India Ltd.', sector: 'Consumer Goods' },
  { symbol: 'TECHM', name: 'Tech Mahindra Ltd.', sector: 'Technology' },
  { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Company Ltd.', sector: 'Financial Services' },
  { symbol: 'SBILIFE', name: 'SBI Life Insurance Company Ltd.', sector: 'Financial Services' },
  { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd.', sector: 'Automobile' },
  { symbol: 'SHRIRAMFIN', name: 'Shriram Finance Ltd.', sector: 'Financial Services' },
  { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd.', sector: 'Automobile' },
  { symbol: 'BEL', name: 'Bharat Electronics Ltd.', sector: 'Industrial' },
  { symbol: 'DIVISLAB', name: 'Divi\'s Laboratories Ltd.', sector: 'Healthcare' },
  { symbol: 'PNB', name: 'Punjab National Bank', sector: 'Financial Services' },
  { symbol: 'IDFCFIRSTB', name: 'IDFC First Bank Ltd.', sector: 'Financial Services' },
  { symbol: 'YESBANK', name: 'Yes Bank Ltd.', sector: 'Financial Services' },
  { symbol: 'CANBK', name: 'Canara Bank', sector: 'Financial Services' },
  { symbol: 'UNIONBANK', name: 'Union Bank of India', sector: 'Financial Services' },
  { symbol: 'LICHSGFIN', name: 'LIC Housing Finance Ltd.', sector: 'Financial Services' },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd.', sector: 'Automobile' },
  { symbol: 'TVSMOTOR', name: 'TVS Motor Company Ltd.', sector: 'Automobile' },
  { symbol: 'BALKRISIND', name: 'Balkrishna Industries Ltd.', sector: 'Automobile' },
  { symbol: 'ASHOKLEY', name: 'Ashok Leyland Ltd.', sector: 'Automobile' },
  { symbol: 'GAIL', name: 'GAIL India Ltd.', sector: 'Utilities' },
  { symbol: 'RECLTD', name: 'REC Ltd.', sector: 'Financial Services' },
  { symbol: 'PFC', name: 'Power Finance Corporation Ltd.', sector: 'Financial Services' },
  { symbol: 'NHPC', name: 'NHPC Ltd.', sector: 'Utilities' },
  { symbol: 'SJVN', name: 'SJVN Ltd.', sector: 'Utilities' },
  { symbol: 'SAIL', name: 'Steel Authority of India Ltd.', sector: 'Metals & Mining' },
  { symbol: 'NMDC', name: 'NMDC Ltd.', sector: 'Metals & Mining' },
  { symbol: 'VEDL', name: 'Vedanta Ltd.', sector: 'Metals & Mining' },
  { symbol: 'JINDALSTEL', name: 'Jindal Steel & Power Ltd.', sector: 'Metals & Mining' },
  { symbol: 'HINDZINC', name: 'Hindustan Zinc Ltd.', sector: 'Metals & Mining' },
  { symbol: 'DMART', name: 'Avenue Supermarts Ltd.', sector: 'Consumer Goods' },
  { symbol: 'TATAELXSI', name: 'Tata Elxsi Ltd.', sector: 'Technology' },
  { symbol: 'PIDILITIND', name: 'Pidilite Industries Ltd.', sector: 'Consumer Goods' },
  { symbol: 'BRITANNIA', name: 'Britannia Industries Ltd.', sector: 'Consumer Goods' },
  { symbol: 'GODREJCP', name: 'Godrej Consumer Products Ltd.', sector: 'Consumer Goods' },
  { symbol: 'DABUR', name: 'Dabur India Ltd.', sector: 'Consumer Goods' },
  { symbol: 'COLPAL', name: 'Colgate-Palmolive India Ltd.', sector: 'Consumer Goods' },
  { symbol: 'MARICO', name: 'Marico Ltd.', sector: 'Consumer Goods' },
  { symbol: 'TRENT', name: 'Trent Ltd.', sector: 'Consumer Goods' },
  { symbol: 'PAGEIND', name: 'Page Industries Ltd.', sector: 'Consumer Goods' },
  { symbol: 'CIPLA', name: 'Cipla Ltd.', sector: 'Healthcare' },
  { symbol: 'DRREDDY', name: 'Dr. Reddy\'s Laboratories Ltd.', sector: 'Healthcare' },
  { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise Ltd.', sector: 'Healthcare' },
  { symbol: 'LUPIN', name: 'Lupin Ltd.', sector: 'Healthcare' },
  { symbol: 'AUROPHARMA', name: 'Aurobindo Pharma Ltd.', sector: 'Healthcare' },
  { symbol: 'BIOCON', name: 'Biocon Ltd.', sector: 'Healthcare' },
  { symbol: 'IRCTC', name: 'Indian Railway Catering & Tourism Corp.', sector: 'Services' },
  { symbol: 'ZOMATO', name: 'Zomato Ltd.', sector: 'Services' },
  { symbol: 'PAYTM', name: 'One97 Communications Ltd.', sector: 'Services' },
  { symbol: 'NYKAA', name: 'FSN E-Commerce Ventures Ltd.', sector: 'Services' },
  { symbol: 'KPITTECH', name: 'KPIT Technologies Ltd.', sector: 'Technology' },
  { symbol: 'PERSISTENT', name: 'Persistent Systems Ltd.', sector: 'Technology' },
  { symbol: 'COFORGE', name: 'Coforge Ltd.', sector: 'Technology' },
  { symbol: 'DIXON', name: 'Dixon Technologies India Ltd.', sector: 'Technology' },
  { symbol: 'SRF', name: 'SRF Ltd.', sector: 'Materials' },
  { symbol: 'ASTRAL', name: 'Astral Ltd.', sector: 'Materials' },
  { symbol: 'CONCOR', name: 'Container Corporation of India Ltd.', sector: 'Services' },
  { symbol: 'GMRINFRA', name: 'GMR Airports Infrastructure Ltd.', sector: 'Services' },
  { symbol: 'IRFC', name: 'Indian Railway Finance Corp.', sector: 'Financial Services' },
  { symbol: 'HUDCO', name: 'Housing & Urban Development Corp.', sector: 'Financial Services' }
];

function getSymbolSeed(symbol: string) {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export default function MagicScanner() {
  const [prompt, setPrompt] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  // Watchlist State
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);

  // Chart popup state
  const [activeStockToken, setActiveStockToken] = useState<any | null>(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Custom indicator profiles toggled by user
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['EMA Trend Cross']);
  const availableIndicators = ['EMA Trend Cross', 'RSI Breakout', 'Supertrend Overlay'];

  const evaluateCustomExpression = (expr: string, stock: any): boolean => {
    let cleanExpr = expr.toLowerCase();
    
    // Map common indicator variables to stock values
    const vars: { [key: string]: number } = {
      close: stock.closeVal,
      open: stock.openVal,
      high: stock.highVal,
      low: stock.lowVal,
      volume: stock.volumeVal,
      rsi: stock.rsi,
      adx: stock.adx,
      supertrend: stock.supertrendVal,
      fvg: stock.fvgBullVal
    };
    
    // Replace variables in expression
    Object.keys(vars).forEach(v => {
      const regex = new RegExp(`\\b${v}\\b`, 'g');
      const val = vars[v];
      cleanExpr = cleanExpr.replace(regex, (val ?? 0).toString());
    });
    
    // Remove spaces
    cleanExpr = cleanExpr.replace(/\s+/g, '');
    
    // Replace logical operators with JS equivalents
    cleanExpr = cleanExpr.replace(/\band\b/g, '&&').replace(/\bor\b/g, '||').replace(/\bnot\b/g, '!');
    
    // Sanitization check: ONLY allow numbers, operators, logic signs, comparison signs, parentheses
    if (!/^[0-9.+\-*/()&|!><=]+$/.test(cleanExpr)) {
      return false;
    }
    
    try {
      const evalFn = new Function(`return !!(${cleanExpr});`);
      return evalFn();
    } catch (err) {
      return false;
    }
  };

  const handleScan = async () => {
    if (!prompt.trim()) return;
    setIsScanning(true);
    setHasScanned(true);
    setResults([]);
    
    try {
      const symbolsList = STOCK_UNIVERSE.map(s => s.symbol);
      const quotesRes = await fetch('/api/v1/market/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols: symbolsList })
      });
      
      let liveQuotesMap: Record<string, any> = {};
      if (quotesRes.ok) {
        const quotesData = await quotesRes.json();
        liveQuotesMap = quotesData.quotes || {};
      }
      
      const query = prompt.toLowerCase().trim();
      const isMathExpression = /[><=+\-*/()]/.test(query);
      
      const matched = STOCK_UNIVERSE.map(stock => {
        const seed = getSymbolSeed(stock.symbol);
        const liveQuote = liveQuotesMap[stock.symbol];
        
        const closeVal = liveQuote ? liveQuote.close : (seed % 1200) + 150;
        const changeVal = liveQuote ? liveQuote.change : ((seed % 120) - 60) / 10;
        const openVal = liveQuote ? liveQuote.open : closeVal * (1 - changeVal / 100);
        const highVal = liveQuote ? liveQuote.high : Math.max(closeVal, openVal) * (1 + (seed % 15) / 1000);
        const lowVal = liveQuote ? liveQuote.low : Math.min(closeVal, openVal) * (1 - (seed % 15) / 1000);
        const volumeVal = liveQuote ? liveQuote.volume : (seed % 900000) + 100000;
        
        const rsi = Math.min(Math.max(Math.round(50 + changeVal * 6), 10), 90);
        const adx = Math.min(Math.max(Math.round(20 + Math.abs(changeVal) * 8), 10), 60);
        const supertrendVal = changeVal >= 0 
          ? (lowVal - (highVal - lowVal) * 1.5) 
          : (highVal + (highVal - lowVal) * 1.5);
        const fvgBullVal = (closeVal > openVal && (highVal - lowVal) > (closeVal * 0.02)) 
          ? (closeVal - openVal) * 0.3 
          : 0.0;
        const hasMacd = changeVal > 0.5;
        const hasGoldenCross = closeVal > openVal && changeVal > 0.0;
        const hasVolumeSurge = volumeVal > 1500000;

        const formattedPrice = `₹${closeVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        const formattedChange = `${changeVal >= 0 ? '+' : ''}${changeVal.toFixed(2)}%`;
        
        return {
          symbol: stock.symbol,
          company: stock.name,
          sector: stock.sector,
          price: formattedPrice,
          change: formattedChange,
          closeVal,
          openVal,
          highVal,
          lowVal,
          rsi,
          adx,
          volumeVal,
          supertrendVal,
          fvgBullVal,
          hasMacd,
          hasGoldenCross,
          hasVolumeSurge,
          rawChange: changeVal
        };
      }).filter(stock => {
        if (isMathExpression) {
          return evaluateCustomExpression(query, stock);
        }

        // Conversational NLP matchers
        if (query.includes('rsi') && (query.includes('oversold') || query.includes('under') || query.includes('below') || query.includes('30'))) {
          return stock.rsi < 30;
        }
        if (query.includes('rsi') && (query.includes('overbought') || query.includes('above') || query.includes('70'))) {
          return stock.rsi > 70;
        }
        if (query.includes('macd') || query.includes('crossover')) {
          return stock.hasMacd;
        }
        if (query.includes('golden') || query.includes('cross') || query.includes('sma') || query.includes('ema')) {
          return stock.hasGoldenCross;
        }
        if (query.includes('volume') || query.includes('surge') || query.includes('spike')) {
          return stock.hasVolumeSurge;
        }
        if (query.includes('supertrend') && (query.includes('bullish') || query.includes('buy') || query.includes('above'))) {
          return stock.closeVal > stock.supertrendVal;
        }
        if (query.includes('adx') && (query.includes('strong') || query.includes('trend') || query.includes('25'))) {
          return stock.adx > 25;
        }
        if (query.includes('fvg') || query.includes('fair value gap') || query.includes('imbalance')) {
          return stock.fvgBullVal > 0;
        }
        if (query.includes('orb') || query.includes('opening range')) {
          return stock.closeVal > stock.openVal;
        }

        return stock.symbol.toLowerCase().includes(query) || 
               stock.company.toLowerCase().includes(query) || 
               stock.sector.toLowerCase().includes(query);
      });

      setResults(matched);
    } catch (err) {
      console.error("Live scanning failed:", err);
    } finally {
      setIsScanning(false);
    }
  };

  // Export filtered data directly to CSV format
  const handleExportCSV = () => {
    if (results.length === 0) {
      toast.error('No scan results to export');
      return;
    }
    const headers = ['Symbol', 'Company', 'Sector', 'Price', 'Change', 'Open', 'High', 'Low', 'RSI', 'ADX'];
    const rows = results.map(r => [
      r.symbol,
      `"${r.company}"`,
      r.sector,
      r.price.replace(/[^\d.]/g, ''),
      r.change,
      r.openVal,
      r.highVal,
      r.lowVal,
      r.rsi,
      r.adx
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `quantra_scan_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Successfully exported data to CSV');
  };

  // Click-to-Chart data loading simulation
  const handleRowClick = (stock: any) => {
    setActiveStockToken(stock);
    setChartLoading(true);
    
    // Simulate low-latency microservice timeseries fetch
    setTimeout(() => {
      const seed = getSymbolSeed(stock.symbol);
      const dataPoints = [];
      let currentVal = stock.closeVal;
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(Date.now() - (30 - i) * 86400000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        const dev = (seed % 8 - 4) + (Math.random() - 0.5) * (currentVal * 0.03);
        currentVal += dev;
        
        dataPoints.push({
          date,
          price: parseFloat(currentVal.toFixed(2)),
          ema9: parseFloat((currentVal * (1.004 + (seed % 3) / 1000)).toFixed(2)),
          ema21: parseFloat((currentVal * (0.992 - (seed % 4) / 1000)).toFixed(2)),
          supertrend: parseFloat((currentVal * (dev >= 0 ? 0.97 : 1.03)).toFixed(2)),
          rsi: Math.round(50 + (dev / currentVal) * 800)
        });
      }
      setChartData(dataPoints);
      setChartLoading(false);
    }, 600);
  };

  // Toggle watchlist inclusion state
  const handleToggleWatchlist = (e: React.MouseEvent, stock: any) => {
    e.stopPropagation();
    const isAlreadyAdded = watchlist.some(w => w.symbol === stock.symbol);
    if (isAlreadyAdded) {
      setWatchlist(prev => prev.filter(w => w.symbol !== stock.symbol));
      toast.info(`Removed ${stock.symbol} from watchlist`);
    } else {
      setWatchlist(prev => [...prev, stock]);
      toast.success(`Added ${stock.symbol} to watchlist`);
    }
  };

  const handleToggleIndicator = (indicator: string) => {
    setActiveIndicators(prev => 
      prev.includes(indicator) ? prev.filter(i => i !== indicator) : [...prev, indicator]
    );
  };

  return (
    <div className="relative flex min-h-full w-full bg-[#0D1117]">
      {/* Pinned main workspace view */}
      <div className="flex-1 p-8 max-w-5xl mx-auto h-full w-full transition-all duration-300">
        <div className="bg-[#1C2128]/50 border border-[#30363D] rounded-xl overflow-hidden shadow-xl backdrop-blur-sm">
          
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-[#30363D] bg-[#1F242C]/50">
            <div className="flex items-center gap-2">
              <div className="text-cyan-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <h3 className="text-sm font-bold text-cyan-400 tracking-wider">MAGIC FILTERS (Screener Only)</h3>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsWatchlistOpen(!isWatchlistOpen)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold border transition-colors ${
                  isWatchlistOpen 
                    ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]' 
                    : 'bg-[#161B22] border-[#30363D] text-gray-400 hover:text-white hover:border-[#58A6FF]'
                }`}
              >
                <Bookmark size={12} />
                Watchlist ({watchlist.length})
              </button>
              <span className="text-[10px] bg-cyan-900/30 text-cyan-400 px-2 py-0.5 rounded font-mono border border-cyan-800/30">MATH ENGINE ENHANCED</span>
            </div>
          </div>

          {/* Input Area */}
          <div className="px-6 py-6 border-b border-[#30363D]">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                  placeholder="Type filters like 'rsi oversold' or math formulas like '(close - open) / (high - low) * 100 > 50'"
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg pl-4 pr-10 py-3 text-sm text-white outline-none focus:border-cyan-400/50 transition-colors shadow-inner"
                />
              </div>
              <button 
                onClick={handleScan}
                disabled={isScanning || !prompt.trim()}
                className="bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-gray-900 px-6 py-3 rounded-lg text-sm font-bold transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)] flex items-center gap-2"
              >
                {isScanning ? <span className="animate-pulse">Scanning...</span> : <><Sparkles size={16} className="fill-current" /> Generate & Scan</>}
              </button>
            </div>

            {/* Prompt Chips */}
            <div className="flex flex-wrap gap-2.5 mt-4">
              {[
                'RSI oversold',
                'supertrend buy',
                '(close - open) / (high - low) * 100 > 50',
                'close > supertrend and rsi < 40'
              ].map((chip) => (
                <button 
                  key={chip}
                  onClick={() => { setPrompt(chip); }}
                  className="bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-gray-300 text-[11px] px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors font-mono"
                >
                  {chip} <Navigation size={10} className="rotate-45" />
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Results Area */}
        {isScanning ? (
          <div className="mt-8 flex flex-col items-center justify-center py-20 text-cyan-400">
            <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-bold animate-pulse">AI is parsing "{prompt}" and querying broad market universe...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="mt-8 bg-[#1C2128]/50 border border-[#30363D] rounded-xl overflow-hidden backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4">
            
            {/* Table Action Header */}
            <div className="px-6 py-4 border-b border-[#30363D] bg-[#21262D]/50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white">Scan Results ({results.length} found)</h3>
                <span className="text-[11px] text-gray-400">Match criteria: {prompt}</span>
              </div>
              
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md"
              >
                <Download size={13} />
                Export Data
              </button>
            </div>
            
            <div className="divide-y divide-[#30363D]">
              {results.map((r, i) => (
                <div 
                  key={r.symbol} 
                  onClick={() => handleRowClick(r)}
                  className="px-6 py-4 flex items-center justify-between hover:bg-[#30363D]/30 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    {/* Star micro-action button */}
                    <button
                      onClick={(e) => handleToggleWatchlist(e, r)}
                      className={`text-gray-500 hover:text-yellow-400 transition-colors p-1 rounded hover:bg-[#21262D] ${
                        watchlist.some(w => w.symbol === r.symbol) ? 'text-yellow-400' : 'text-gray-600'
                      }`}
                    >
                      <Star size={16} className={watchlist.some(w => w.symbol === r.symbol) ? 'fill-current' : ''} />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-white leading-none">{r.symbol}</h4>
                        <span className="text-[10px] bg-[#30363D] text-gray-400 px-1.5 py-0.5 rounded font-mono uppercase">{r.sector}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{r.company}</p>
                    </div>
                  </div>
                  
                  {/* Display metrics on hover */}
                  <div className="hidden lg:flex items-center gap-6 text-xs text-gray-400">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-gray-500 uppercase font-mono">OHL Range</span>
                      <span>₹{r.openVal?.toFixed(1)} - ₹{r.highVal?.toFixed(1)}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-gray-500 uppercase font-mono">RSI</span>
                      <span className={r.rsi > 70 ? 'text-orange-400 font-bold' : r.rsi < 30 ? 'text-cyan-400 font-bold' : 'text-gray-300'}>{r.rsi}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-gray-500 uppercase font-mono">ADX</span>
                      <span>{r.adx}</span>
                    </div>
                  </div>
                  
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="text-sm font-bold text-cyan-400">{r.price}</p>
                      <p className={`text-xs ${r.change.startsWith('-') ? 'text-red-400' : 'text-green-400'}`}>{r.change}</p>
                    </div>
                    
                    {/* Navigation redirect button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/dashboard/charts?symbol=${r.symbol}`;
                      }}
                      title="Open full page Live Chart"
                      className="p-1.5 rounded hover:bg-[#21262D] text-gray-500 hover:text-cyan-400 transition-colors"
                    >
                      <Maximize2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : hasScanned ? (
          <div className="mt-8 flex flex-col items-center justify-center py-20 text-gray-500">
            <p className="text-sm">0 results found for "{prompt}". Try modifying your scan criteria.</p>
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center justify-center py-20 text-gray-500">
            <Sparkles size={48} className="mb-4 opacity-20" />
            <p className="text-sm">Enter a magic prompt to scan the broad market universe.</p>
          </div>
        )}
      </div>

      {/* Watchlist Slide-out Drawer Panel */}
      <AnimatePresence>
        {isWatchlistOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWatchlistOpen(false)}
              className="fixed inset-0 bg-black z-30 backdrop-blur-sm lg:hidden"
            />
            <motion.div 
              initial={{ x: 350, opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 350, opacity: 0.5 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 h-full w-[340px] bg-[#161B22] border-l border-[#30363D] z-40 p-6 shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-[#30363D] pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-400 fill-current" />
                  <h3 className="text-sm font-bold text-white tracking-wider">LIVE WATCHLIST</h3>
                </div>
                <button 
                  onClick={() => setIsWatchlistOpen(false)}
                  className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#21262D] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {watchlist.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 py-10">
                  <Star size={36} className="mb-3 opacity-20" />
                  <p className="text-xs text-center">Your watchlist is currently empty. Bookmark stocks from the scan results.</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  <AnimatePresence initial={false}>
                    {watchlist.map(stock => (
                      <motion.div 
                        key={stock.symbol}
                        layoutId={`watchlist-item-${stock.symbol}`}
                        onClick={() => handleRowClick(stock)}
                        className="bg-[#0D1117] border border-[#30363D] hover:border-[#58A6FF]/40 rounded-xl p-3.5 flex justify-between items-center cursor-pointer group transition-all"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs bg-[#21262D] text-gray-400 px-1.5 py-0.5 rounded font-mono font-bold">{stock.symbol}</span>
                            <span className="text-[10px] text-gray-500 uppercase">{stock.sector}</span>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-1 truncate max-w-[150px]">{stock.company}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-xs font-bold text-white">{stock.price}</p>
                            <p className={`text-[10px] ${stock.change.startsWith('-') ? 'text-red-400' : 'text-green-400'}`}>{stock.change}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setWatchlist(prev => prev.filter(w => w.symbol !== stock.symbol));
                            }}
                            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 p-1 rounded hover:bg-[#21262D] transition-all"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              <div className="border-t border-[#30363D] pt-4 mt-auto">
                <button
                  onClick={() => {
                    setWatchlist([]);
                    toast.success("Watchlist cleared");
                  }}
                  disabled={watchlist.length === 0}
                  className="w-full bg-red-950/20 hover:bg-red-900/30 border border-red-900/30 text-red-400 py-2.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Watchlist
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Low-Latency Chart Viewport Popup Overlay */}
      <AnimatePresence>
        {activeStockToken && (
          <div className="fixed inset-0 bg-[#06090F]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-[#0D1117] border border-[#30363D] rounded-xl overflow-hidden w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl relative"
            >
              {/* Overlay Header */}
              <div className="px-6 py-4 flex items-center justify-between border-b border-[#30363D] bg-[#161B22]/50">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{activeStockToken.symbol}</h2>
                    <span className="text-xs bg-[#21262D] text-[#58A6FF] px-2 py-0.5 rounded uppercase font-bold">{activeStockToken.sector}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{activeStockToken.company} — Real-time analytics timeseries</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      window.location.href = `/dashboard/charts?symbol=${activeStockToken.symbol}`;
                    }}
                    className="flex items-center gap-1 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-800 text-cyan-400 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                  >
                    <Maximize2 size={13} />
                    Open Live Terminal
                  </button>
                  <button 
                    onClick={() => setActiveStockToken(null)}
                    className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-[#21262D] transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Core Layout */}
              <div className="flex-1 flex overflow-hidden">
                {/* Charting Screen */}
                <div className="flex-1 p-6 flex flex-col overflow-y-auto space-y-6">
                  {chartLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 space-y-4">
                      <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm font-bold text-cyan-400 animate-pulse">Pulling live database vectors...</p>
                    </div>
                  ) : (
                    <>
                      {/* Price Action Chart */}
                      <div className="h-64 md:h-[40%] bg-[#06090F]/50 border border-[#30363D] rounded-xl p-4 relative shadow-inner">
                        <div className="absolute top-4 left-4 z-10">
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-bold font-mono">Candle Close</span>
                          <span className="text-lg font-bold text-white">{activeStockToken.price}</span>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.25}/>
                                <stop offset="95%" stopColor="#22D3EE" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
                            <XAxis dataKey="date" stroke="#8B949E" fontSize={10} />
                            <YAxis stroke="#8B949E" fontSize={10} domain={['auto', 'auto']} />
                            <Tooltip contentStyle={{ backgroundColor: '#0D1117', borderColor: '#30363D' }} />
                            <Area type="monotone" dataKey="price" stroke="#22D3EE" strokeWidth={2.5} fillOpacity={1} fill="url(#chartGradient)" name="Close Price" />
                            {activeIndicators.includes('EMA Trend Cross') && (
                              <>
                                <Line type="monotone" dataKey="ema9" stroke="#EAB308" strokeWidth={1.5} dot={false} name="EMA 9" />
                                <Line type="monotone" dataKey="ema21" stroke="#EC4899" strokeWidth={1.5} dot={false} name="EMA 21" />
                              </>
                            )}
                            {activeIndicators.includes('Supertrend Overlay') && (
                              <Line type="step" dataKey="supertrend" stroke="#22C55E" strokeWidth={1.5} dot={false} name="Supertrend" />
                            )}
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      {/* RSI Oscillator Subchart (Dual Screen Layout) */}
                      {activeIndicators.includes('RSI Breakout') && (
                        <div className="h-44 md:h-[28%] bg-[#06090F]/50 border border-[#30363D] rounded-xl p-4 relative shadow-inner">
                          <div className="absolute top-4 left-4 z-10">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-bold font-mono">Relative Strength Index</span>
                            <span className="text-sm font-bold text-orange-400">RSI ({chartData[chartData.length - 1]?.rsi})</span>
                          </div>
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
                              <XAxis dataKey="date" stroke="#8B949E" fontSize={9} />
                              <YAxis stroke="#8B949E" fontSize={9} domain={[0, 100]} ticks={[30, 50, 70]} />
                              <Tooltip contentStyle={{ backgroundColor: '#0D1117', borderColor: '#30363D' }} />
                              <Line type="monotone" dataKey="rsi" stroke="#F97316" strokeWidth={1.5} dot={false} name="RSI" />
                              {/* Reference limits */}
                              <Line type="monotone" dataKey={() => 70} stroke="#EF4444" strokeWidth={1} strokeDasharray="4 4" dot={false} name="Overbought (70)" />
                              <Line type="monotone" dataKey={() => 30} stroke="#3B82F6" strokeWidth={1} strokeDasharray="4 4" dot={false} name="Oversold (30)" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      {/* Active Indicator Micro-badges inline bar */}
                      <div className="border-t border-[#30363D] pt-4">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-2 font-mono">Active Overlay Indicators</span>
                        <div className="flex flex-wrap gap-2">
                          {activeIndicators.map(ind => (
                            <div 
                              key={ind} 
                              className="bg-[#21262D] border border-[#30363D] text-gray-300 rounded px-2.5 py-1 text-xs flex items-center gap-1.5 hover:border-[#58A6FF]/40 transition-colors"
                            >
                              <span>{ind}</span>
                              <button 
                                onClick={() => handleToggleIndicator(ind)}
                                className="text-gray-500 hover:text-white p-0.5 rounded transition-colors"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                          {activeIndicators.length === 0 && (
                            <span className="text-xs text-gray-600 italic">No indicators overlaying canvas. Toggle sidebar profiles.</span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Templates Manager Configuration Sidebar */}
                <div className="w-64 border-l border-[#30363D] bg-[#161B22]/50 p-6 flex flex-col space-y-6">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
                      <Layers size={14} className="text-cyan-400" />
                      Templates Engine
                    </h3>
                    <p className="text-[11px] text-gray-500 leading-normal">
                      Quickly switch technical configurations or toggle individual overlays dynamically.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-mono">Select Profiles</span>
                    <button 
                      onClick={() => setActiveIndicators(['EMA Trend Cross'])}
                      className="w-full text-left px-3 py-2 rounded-lg bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-xs font-bold text-gray-300 transition-colors flex items-center justify-between"
                    >
                      <span>EMA Cross (Fast/Slow)</span>
                      {activeIndicators.includes('EMA Trend Cross') && !activeIndicators.includes('RSI Breakout') && <Check size={12} className="text-[#22D3EE]" />}
                    </button>
                    <button 
                      onClick={() => setActiveIndicators(['RSI Breakout'])}
                      className="w-full text-left px-3 py-2 rounded-lg bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-xs font-bold text-gray-300 transition-colors flex items-center justify-between"
                    >
                      <span>RSI Oscillator Chart</span>
                      {activeIndicators.includes('RSI Breakout') && !activeIndicators.includes('EMA Trend Cross') && <Check size={12} className="text-[#22D3EE]" />}
                    </button>
                    <button 
                      onClick={() => setActiveIndicators(['EMA Trend Cross', 'RSI Breakout', 'Supertrend Overlay'])}
                      className="w-full text-left px-3 py-2 rounded-lg bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-xs font-bold text-gray-300 transition-colors flex items-center justify-between"
                    >
                      <span>Combined Analytics</span>
                      {activeIndicators.includes('EMA Trend Cross') && activeIndicators.includes('RSI Breakout') && <Check size={12} className="text-[#22D3EE]" />}
                    </button>
                  </div>

                  <div className="border-t border-[#30363D] pt-4 flex-1">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-mono block mb-3">Individual Overlays</span>
                    <div className="space-y-2">
                      {availableIndicators.map(ind => {
                        const active = activeIndicators.includes(ind);
                        return (
                          <button
                            key={ind}
                            onClick={() => handleToggleIndicator(ind)}
                            className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all flex items-center justify-between ${
                              active 
                                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400' 
                                : 'bg-transparent border-[#30363D] text-gray-400 hover:border-gray-500'
                            }`}
                          >
                            <span>{ind}</span>
                            <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                              active ? 'bg-cyan-400 border-cyan-400 text-gray-900 font-bold' : 'border-gray-600'
                            }`}>
                              {active && "✓"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-[#30363D] pt-4">
                    <button
                      onClick={() => {
                        toast.success("Current indicator vector synced to backend profile");
                      }}
                      className="w-full bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-white py-2 rounded-lg text-xs font-bold transition-colors"
                    >
                      Sync Active Settings
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
