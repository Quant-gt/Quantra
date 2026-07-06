"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';

export interface StockInfo {
  symbol: string;
  name: string;
  keywords: string[];
}

interface DynamicSearchResult {
  symbol: string;
  exchangeSymbol: string;
  name: string;
  exchange: string;
  type: string;
}

interface StockSearchProps {
  onSelect: (symbol: string) => void;
}

export default function StockSearch({ onSelect }: StockSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [defaultRecommendations, setDefaultRecommendations] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

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

  // Pre-fetch a default list of popular Indian symbols on mount
  useEffect(() => {
    const fetchDefaults = async () => {
      try {
        const res = await fetch(`/api/v1/search?q=Nifty`);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const formatted = data.results.slice(0, 5).map((r: DynamicSearchResult) => ({
            symbol: r.symbol,
            name: r.name,
            keywords: [r.exchange, r.type].filter(Boolean)
          }));
          setDefaultRecommendations(formatted);
        }
      } catch (err) {
        console.error("Failed to pre-fetch default stock search suggestions:", err);
      }
    };
    fetchDefaults();
  }, []);

  const searchAPI = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(defaultRecommendations);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      
      let fetchedResults = [];
      if (data.results && data.results.length > 0) {
        fetchedResults = data.results.map((r: DynamicSearchResult) => ({
          symbol: r.symbol,
          name: r.name,
          keywords: [r.exchange, r.type].filter(Boolean)
        }));
      }

      setResults(fetchedResults.slice(0, 10)); // Top 10 results
      setIsOpen(true);
    } catch (err) {
      console.error("Search API failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    
    if (val.trim() === '') {
      setResults(defaultRecommendations);
      setIsOpen(true);
      return;
    }

    // Debounce the network request
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchAPI(val);
    }, 450);
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
            if (query.trim() === '') {
              setResults(defaultRecommendations);
            }
            setIsOpen(true);
          }}
          placeholder="Search any stock by name, symbol..."
          className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl pl-10 pr-10 py-2.5 text-white focus:border-[#58A6FF] outline-none transition-colors text-sm shadow-inner"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#58A6FF] animate-spin" size={16} />
        )}
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
                    {stock.keywords.map((kw: string) => (
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
              {isLoading ? "Searching global markets..." : "No matches found."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
