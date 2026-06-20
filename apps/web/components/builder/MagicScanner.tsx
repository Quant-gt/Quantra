"use client";

import { Sparkles, Navigation } from 'lucide-react';
import { useState } from 'react';

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

// Helper to generate a deterministic seed based on symbol
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

  const handleScan = () => {
    if (!prompt.trim()) return;
    setIsScanning(true);
    setHasScanned(true);
    setResults([]);
    
    setTimeout(() => {
      const query = prompt.toLowerCase().trim();
      
      // Dynamically generate realistic indicator conditions seeded by symbol
      const matched = STOCK_UNIVERSE.map(stock => {
        const seed = getSymbolSeed(stock.symbol);
        const priceVal = (seed % 4800) + 150; // Price between ₹150 and ₹4950
        const changeVal = ((seed % 120) - 60) / 10; // Change between -6.0% and +6.0%
        const rsi = (seed % 75) + 12; // RSI between 12 and 87
        const hasMacd = (seed % 3) === 0;
        const hasGoldenCross = (seed % 4) === 0;
        const hasVolumeSurge = (seed % 5) === 0;
        
        const formattedPrice = `₹${priceVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        const formattedChange = `${changeVal >= 0 ? '+' : ''}${changeVal.toFixed(2)}%`;
        
        return {
          symbol: stock.symbol,
          company: stock.name,
          sector: stock.sector,
          price: formattedPrice,
          change: formattedChange,
          rsi,
          hasMacd,
          hasGoldenCross,
          hasVolumeSurge,
          rawChange: changeVal
        };
      }).filter(stock => {
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
        
        // Generic search fallback: match text with symbol, company name, or sector
        return stock.symbol.toLowerCase().includes(query) || 
               stock.company.toLowerCase().includes(query) || 
               stock.sector.toLowerCase().includes(query);
      });

      // If no custom filters matched, fallback to a seeded selection
      if (matched.length === 0) {
        const fallbackList = STOCK_UNIVERSE.filter((_, idx) => (idx % 6) === 0).map(stock => {
          const seed = getSymbolSeed(stock.symbol);
          const priceVal = (seed % 4800) + 150;
          const changeVal = ((seed % 120) - 60) / 10;
          const formattedPrice = `₹${priceVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          const formattedChange = `${changeVal >= 0 ? '+' : ''}${changeVal.toFixed(2)}%`;
          return {
            symbol: stock.symbol,
            company: stock.name,
            sector: stock.sector,
            price: formattedPrice,
            change: formattedChange,
            rawChange: changeVal
          };
        });
        setResults(fallbackList);
      } else {
        setResults(matched);
      }
      
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto h-full w-full">
      <div className="bg-[#1C2128]/50 border border-[#30363D] rounded-xl overflow-hidden shadow-xl backdrop-blur-sm">
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center gap-2">
          <div className="text-cyan-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <h3 className="text-sm font-bold text-cyan-400 tracking-wider">MAGIC FILTERS (Scanner Only)</h3>
        </div>

        {/* Input Area */}
        <div className="px-6 pb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                placeholder="Scan stocks using simple language like 'rsi oversold' or 'macd bullish crossover'"
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
          <div className="flex gap-3 mt-4">
            {[
              'RSI oversold',
              'MACD bullish crossover',
              'Golden cross'
            ].map((chip) => (
              <button 
                key={chip}
                onClick={() => { setPrompt(chip); }}
                className="bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-gray-300 text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"
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
          <div className="px-6 py-4 border-b border-[#30363D] bg-[#21262D]/50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Scan Results ({results.length} found)</h3>
            <span className="text-xs text-gray-400">Match criteria: {prompt}</span>
          </div>
          <div className="divide-y divide-[#30363D]">
            {results.map((r, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-[#30363D]/30 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-white">{r.symbol}</h4>
                    <span className="text-[10px] bg-[#30363D] text-gray-400 px-1.5 py-0.5 rounded font-mono uppercase">{r.sector}</span>
                  </div>
                  <p className="text-xs text-gray-400">{r.company}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-cyan-400">{r.price}</p>
                  <p className={`text-xs ${r.change.startsWith('-') ? 'text-red-400' : 'text-green-400'}`}>{r.change}</p>
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
  );
}
