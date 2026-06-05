"use client";

import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, Calendar, Clock, Globe, Maximize2, Settings, Crosshair, ArrowUpRight, ArrowDownRight, Activity, X, Plus, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { feed, Tick } from '@/lib/engine/feed';
import StockSearch from '@/components/charts/StockSearch';

const TVChart = dynamic(() => import('@/components/charts/TVChart'), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-[#0B0F19]"><Loader2 className="animate-spin text-[#388BFD]" size={32} /></div>
});

export default function DashboardChartsPage() {
  const [activeTab, setActiveTab] = useState('1D');
  const [activeSymbol, setActiveSymbol] = useState('RELIANCE');
  const [liveData, setLiveData] = useState<{ price: number, change: number, changePct: number }>({ price: 2951.71, change: -3.11, changePct: -0.11 });
  
  const [watchlist, setWatchlist] = useState<Record<string, { price: number; change: string; positive: boolean }>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Initial watchlist load on mount
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('quantra_watchlist') : null;
    let activeList = ['NIFTY 50', 'BANKNIFTY', 'RELIANCE', 'TCS', 'INFY', 'HDFC BANK', 'ICICI BANK', 'SBI'];
    if (saved) {
      try {
        activeList = JSON.parse(saved);
      } catch (err) {
        console.error('Failed to parse watchlist from storage:', err);
      }
    }
    
    const initialWatchlist: Record<string, { price: number; change: string; positive: boolean }> = {};
    const defaultPrices: Record<string, number> = {
      'NIFTY 50': 23507.25,
      'BANKNIFTY': 48084.09,
      'RELIANCE': 2951.71,
      'TCS': 3924.43,
      'INFY': 1422.13,
      'HDFC BANK': 1517.53,
      'ICICI BANK': 1120.90,
      'SBI': 780.40
    };

    activeList.forEach(sym => {
      initialWatchlist[sym] = {
        price: defaultPrices[sym] || 100.00,
        change: '0.00%',
        positive: true
      };
    });
    setWatchlist(initialWatchlist);

    // Register active list with client feed
    feed.updateSymbols(activeList);
    
    // Set first item in active list as default active symbol if RELIANCE is deleted
    if (activeList.length > 0 && !activeList.includes('RELIANCE')) {
      setActiveSymbol(activeList[0]!);
    }
  }, []);

  // 2. Listen to price feed ticks
  useEffect(() => {
    const handleTick = (tick: Tick) => {
      // Update watchlist item dynamically
      setWatchlist(prev => {
        if (!prev[tick.symbol]) return prev;
        return {
          ...prev,
          [tick.symbol]: {
            price: tick.price,
            change: `${tick.change >= 0 ? '+' : ''}${tick.changePct}%`,
            positive: tick.change >= 0
          }
        };
      });

      // Update main chart header
      if (tick.symbol === activeSymbol) {
        setLiveData({ price: tick.price, change: tick.change, changePct: tick.changePct });
      }
    };
    const unsubscribe = feed.subscribe(handleTick);
    return () => unsubscribe();
  }, [activeSymbol, watchlist]);

  const handleAddSymbol = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const cleanSym = searchQuery.trim().toUpperCase();
    
    if (watchlist[cleanSym]) {
      alert(`${cleanSym} is already in your watchlist.`);
      return;
    }

    const updatedList = [...Object.keys(watchlist), cleanSym];
    localStorage.setItem('quantra_watchlist', JSON.stringify(updatedList));

    setWatchlist(prev => ({
      ...prev,
      [cleanSym]: { price: 100.00, change: '0.00%', positive: true }
    }));

    feed.updateSymbols(updatedList);
    setSearchQuery('');
    setIsAddModalOpen(false);
  };

  const handleDeleteSymbol = (e: React.MouseEvent, symbolToDelete: string) => {
    e.stopPropagation();
    const updatedList = Object.keys(watchlist).filter(s => s !== symbolToDelete);
    localStorage.setItem('quantra_watchlist', JSON.stringify(updatedList));

    setWatchlist(prev => {
      const next = { ...prev };
      delete next[symbolToDelete];
      return next;
    });

    feed.updateSymbols(updatedList);
    
    if (activeSymbol === symbolToDelete && updatedList.length > 0) {
      setActiveSymbol(updatedList[0]!);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-[#0D1117] min-h-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
              <div className="p-2 bg-[#58A6FF]/10 rounded-lg border border-[#58A6FF]/20">
                <BarChart2 className="text-[#58A6FF]" size={28} />
              </div>
              Terminal Charts
            </h1>
            <p className="text-gray-400 text-sm mt-2 max-w-xl leading-relaxed">
              Ultra-low latency price action visualization with integrated volume profiles and algorithmic overlay indicators.
            </p>
          </div>
          
          {/* New Search Bar Location */}
          <div className="w-full max-w-md">
            <StockSearch 
              onSelect={(symbol) => {
                if (!watchlist[symbol]) {
                  const updatedList = [...Object.keys(watchlist), symbol];
                  localStorage.setItem('quantra_watchlist', JSON.stringify(updatedList));
                  setWatchlist(prev => ({
                    ...prev,
                    [symbol]: { price: 100.00, change: '0.00%', positive: true }
                  }));
                  feed.updateSymbols(updatedList);
                }
                setActiveSymbol(symbol);
              }}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto items-end">
          <div className="flex gap-2">
          <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-1 flex gap-1">
            {['1M', '5M', '15M', '1H', '1D', '1W'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  activeTab === tab 
                  ? 'bg-[#388BFD] text-white shadow-[0_0_10px_rgba(56,139,253,0.3)]' 
                  : 'text-gray-500 hover:text-white hover:bg-[#30363D]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="bg-[#161B22] border border-[#30363D] hover:border-[#8B949E] rounded-lg p-2 text-gray-400 hover:text-white transition-all shadow-lg">
            <Settings size={18} />
          </button>
          <button className="bg-[#161B22] border border-[#30363D] hover:border-[#8B949E] rounded-lg p-2 text-gray-400 hover:text-white transition-all shadow-lg">
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-3 bg-[#161B22]/80 backdrop-blur-xl border border-[#30363D] rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Chart Header */}
          <div className="p-4 border-b border-[#30363D] bg-[#0D1117]/80 flex justify-between items-center">
            <div className="flex gap-6 items-center">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-black text-white text-2xl tracking-tight">{activeSymbol}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-[#388BFD]/10 text-[#58A6FF] px-2 py-0.5 rounded border border-[#388BFD]/30">NSE:EQ</span>
                </div>
                <div className="text-gray-400 text-xs mt-1">Live Tick Data Feed</div>
              </div>
              <div className="h-10 w-px bg-[#30363D]"></div>
              <div>
                <div className={`text-3xl font-mono font-bold flex items-center gap-2 ${liveData.change >= 0 ? 'text-[#39D353]' : 'text-[#F85149]'}`}>
                  ₹ {liveData.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  {liveData.change >= 0 ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                </div>
                <div className={`text-sm font-mono font-bold tracking-wide ${liveData.change >= 0 ? 'text-[#39D353]' : 'text-[#F85149]'}`}>
                  {liveData.change > 0 ? "+" : ""}{liveData.change} ({liveData.changePct > 0 ? "+" : ""}{liveData.changePct}%)
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex gap-6 text-sm font-mono text-gray-400 bg-[#0D1117] border border-[#30363D] px-4 py-2 rounded-lg">
              <div className="flex flex-col"><span className="text-[10px] text-gray-600">HIGH</span><span className="text-white">--</span></div>
              <div className="flex flex-col"><span className="text-[10px] text-gray-600">LOW</span><span className="text-white">--</span></div>
              <div className="flex flex-col"><span className="text-[10px] text-gray-600">OPEN</span><span className="text-white">--</span></div>
              <div className="flex flex-col"><span className="text-[10px] text-gray-600">VOLUME</span><span className="text-white">--</span></div>
            </div>
          </div>

          {/* TV Chart Container */}
          <div className="flex-1 relative min-h-[400px]">
            <TVChart symbol={activeSymbol} />
          </div>
        </div>

        {/* Watchlist Panel */}
        <div className="bg-[#161B22]/80 backdrop-blur-xl border border-[#30363D] rounded-xl shadow-2xl flex flex-col">
          <div className="p-4 border-b border-[#30363D] bg-[#0D1117]/80 flex justify-between items-center">
            <h2 className="font-bold text-white text-sm tracking-wide flex items-center gap-2">
              <Globe size={16} className="text-[#58A6FF]" />
              MARKET WATCH
            </h2>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="text-[#58A6FF] hover:text-white transition-colors text-xs font-bold bg-[#388BFD]/10 px-2 py-1 rounded flex items-center gap-1 cursor-pointer"
            >
              <Plus size={12} /> ADD
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-[#30363D]/50">
              {Object.entries(watchlist).map(([symbol, item]) => (
                <div 
                  key={symbol} 
                  onClick={() => setActiveSymbol(symbol)}
                  className={`flex justify-between items-center p-4 hover:bg-[#1C2128] transition-colors cursor-pointer group ${activeSymbol === symbol ? 'bg-[#1C2128]/50 border-l-4 border-l-[#388BFD]' : 'border-l-4 border-l-transparent'}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-white group-hover:text-[#58A6FF] transition-colors tracking-tight truncate">{symbol}</div>
                      
                      {/* Hide default index symbols from delete to protect layout */}
                      {!['NIFTY 50', 'BANKNIFTY'].includes(symbol) && (
                        <button
                          onClick={(e) => handleDeleteSymbol(e, symbol)}
                          className="opacity-50 hover:opacity-100 p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all ml-auto shrink-0 md:opacity-0 md:group-hover:opacity-100"
                          title={`Remove ${symbol}`}
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-0.5 flex items-center gap-1">
                      <Activity size={10} /> Vol: {(Math.random() * 5 + 1).toFixed(1)}M
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="font-mono font-bold text-white">
                      {item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`text-xs font-mono font-bold flex items-center justify-end gap-1 ${item.positive ? 'text-[#39D353]' : 'text-[#F85149]'}`}>
                      {item.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {item.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Stock Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161B22] border border-[#30363D] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Plus size={20} className="text-[#58A6FF]" />
                Add NSE Stock
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddSymbol} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Stock Symbol / Ticker</label>
                <input 
                  type="text" 
                  required
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                  placeholder="e.g. TATASTEEL, ITC, IRFC, ONGC" 
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-white focus:border-[#58A6FF] outline-none transition-colors font-mono" 
                />
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Enter any stock ticker listed on the National Stock Exchange (NSE). The system will fetch real-time quotes dynamically.
                </p>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-[#30363D]">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-[#30363D] text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg text-sm font-bold transition-all shadow-lg"
                >
                  Add Ticker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
