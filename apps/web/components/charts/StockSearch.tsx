"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';

export interface StockInfo {
  symbol: string;
  name: string;
  keywords: string[];
}

// A curated list of popular NSE stocks to power the search
const NSE_STOCKS: StockInfo[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Limited', keywords: ['oil', 'gas', 'telecom', 'jio', 'retail'] },
  { symbol: 'TCS', name: 'Tata Consultancy Services Limited', keywords: ['it', 'software', 'technology', 'tata'] },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', keywords: ['bank', 'financial', 'private'] },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Limited', keywords: ['bank', 'financial', 'private'] },
  { symbol: 'INFY', name: 'Infosys Limited', keywords: ['it', 'software', 'technology'] },
  { symbol: 'SBI', name: 'State Bank of India', keywords: ['bank', 'psu', 'government', 'financial'] },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Limited', keywords: ['telecom', 'mobile', 'internet'] },
  { symbol: 'ITC', name: 'ITC Limited', keywords: ['fmcg', 'tobacco', 'hotels', 'paper'] },
  { symbol: 'L&T', name: 'Larsen & Toubro Limited', keywords: ['construction', 'engineering', 'infrastructure'] },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Limited', keywords: ['finance', 'nbfc', 'loans'] },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Limited', keywords: ['fmcg', 'consumer', 'goods'] },
  { symbol: 'AXISBANK', name: 'Axis Bank Limited', keywords: ['bank', 'financial', 'private'] },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Limited', keywords: ['bank', 'financial', 'private'] },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Limited', keywords: ['auto', 'cars', 'automobiles'] },
  { symbol: 'TATASTEEL', name: 'Tata Steel Limited', keywords: ['metal', 'steel', 'tata'] },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries', keywords: ['pharma', 'healthcare', 'medicine'] },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Limited', keywords: ['cement', 'construction', 'birla'] },
  { symbol: 'TITAN', name: 'Titan Company Limited', keywords: ['jewelry', 'watches', 'tata'] },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Limited', keywords: ['paints', 'chemicals', 'home'] },
  { symbol: 'NTPC', name: 'NTPC Limited', keywords: ['power', 'energy', 'psu'] },
  { symbol: 'TATOMOTORS', name: 'Tata Motors Limited', keywords: ['auto', 'cars', 'ev', 'tata'] },
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corporation', keywords: ['oil', 'gas', 'psu'] },
  { symbol: 'WIPRO', name: 'Wipro Limited', keywords: ['it', 'software', 'technology'] },
  { symbol: 'M&M', name: 'Mahindra & Mahindra Limited', keywords: ['auto', 'tractors', 'ev'] },
  { symbol: 'POWERGRID', name: 'Power Grid Corporation', keywords: ['power', 'energy', 'psu'] },
  { symbol: 'HCLTECH', name: 'HCL Technologies Limited', keywords: ['it', 'software', 'technology'] },
  { symbol: 'ZOMATO', name: 'Zomato Limited', keywords: ['food', 'delivery', 'tech'] },
  { symbol: 'JIOFIN', name: 'Jio Financial Services', keywords: ['finance', 'jio', 'nbfc'] },
  { symbol: 'ADANIENT', name: 'Adani Enterprises Limited', keywords: ['infrastructure', 'adani'] },
  { symbol: 'COALINDIA', name: 'Coal India Limited', keywords: ['mining', 'coal', 'psu'] },
  { symbol: 'NIFTY 50', name: 'Nifty 50 Index', keywords: ['index', 'benchmark', 'nse'] },
  { symbol: 'BANKNIFTY', name: 'Nifty Bank Index', keywords: ['index', 'banking', 'nse'] }
];

interface StockSearchProps {
  onSelect: (symbol: string) => void;
}

export default function StockSearch({ onSelect }: StockSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockInfo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Click outside to close dropdown
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    
    if (val.trim() === '') {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchLower = val.toLowerCase();
    
    const filtered = NSE_STOCKS.filter(stock => {
      const matchSymbol = stock.symbol.toLowerCase().includes(searchLower);
      const matchName = stock.name.toLowerCase().includes(searchLower);
      const matchKeyword = stock.keywords.some(k => k.toLowerCase().includes(searchLower));
      return matchSymbol || matchName || matchKeyword;
    });

    setResults(filtered.slice(0, 10)); // Limit to top 10 results
    setIsOpen(true);
  };

  const handleSelect = (symbol: string) => {
    onSelect(symbol);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          onFocus={() => {
            if (query.trim() !== '') setIsOpen(true);
          }}
          placeholder="Search stocks by name, symbol, or keyword..."
          className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-[#58A6FF] outline-none transition-colors text-sm shadow-inner"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#161B22] border border-[#30363D] rounded-xl shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            <ul className="divide-y divide-[#30363D]">
              {results.map((stock) => (
                <li 
                  key={stock.symbol}
                  onClick={() => handleSelect(stock.symbol)}
                  className="p-3 hover:bg-[#1C2128] transition-colors cursor-pointer group flex flex-col gap-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white group-hover:text-[#58A6FF] transition-colors">{stock.symbol}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-[#30363D] text-gray-400 px-1.5 py-0.5 rounded">EQ</span>
                  </div>
                  <div className="text-xs text-gray-400 truncate">{stock.name}</div>
                  <div className="flex gap-1.5 flex-wrap mt-1">
                    {stock.keywords.map(kw => (
                      <span key={kw} className="text-[9px] text-[#388BFD] bg-[#388BFD]/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {kw}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              No exact matches found. You can still hit "Add" to fetch it dynamically.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
