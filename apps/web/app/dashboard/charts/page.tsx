"use client";

import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, Calendar, Clock, Globe, Maximize2, Settings, Crosshair, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import TVChart from '@/components/charts/TVChart';
import { feed, Tick } from '@/lib/engine/feed';

export default function DashboardChartsPage() {
  const [activeTab, setActiveTab] = useState('1D');
  const [activeSymbol, setActiveSymbol] = useState('RELIANCE');
  const [liveData, setLiveData] = useState<{ price: number, change: number, changePct: number }>({ price: 2575.00, change: 35.00, changePct: 1.38 });

  // Subscribe to feed for just the header numbers
  useEffect(() => {
    const handleTick = (tick: Tick) => {
      if (tick.symbol === activeSymbol) {
        setLiveData({ price: tick.price, change: tick.change, changePct: tick.changePct });
      }
    };
    const unsubscribe = feed.subscribe(handleTick);
    return () => unsubscribe();
  }, [activeSymbol]);

  return (
    <div className="p-4 md:p-8 bg-[#0D1117] min-h-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
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
            <button className="text-[#58A6FF] hover:text-white transition-colors text-xs font-bold bg-[#388BFD]/10 px-2 py-1 rounded">
              + ADD
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-[#30363D]/50">
              {[
                { symbol: "NIFTY 50", price: "22,453.80", change: "+0.45%", positive: true },
                { symbol: "BANKNIFTY", price: "48,210.50", change: "-0.20%", positive: false },
                { symbol: "RELIANCE", price: "2,575.00", change: "+1.38%", positive: true },
                { symbol: "TCS", price: "3,210.45", change: "-0.50%", positive: false },
                { symbol: "INFY", price: "1,420.30", change: "+2.10%", positive: true },
                { symbol: "HDFC BANK", price: "1,530.20", change: "+0.80%", positive: true },
                { symbol: "ICICI BANK", price: "1,120.90", change: "+1.15%", positive: true },
                { symbol: "SBI", price: "780.40", change: "-1.20%", positive: false },
              ].map((item, i) => (
                <div 
                  key={item.symbol} 
                  onClick={() => setActiveSymbol(item.symbol)}
                  className={`flex justify-between items-center p-4 hover:bg-[#1C2128] transition-colors cursor-pointer group ${activeSymbol === item.symbol ? 'bg-[#1C2128]/50 border-l-4 border-l-[#388BFD]' : 'border-l-4 border-l-transparent'}`}
                >
                  <div>
                    <div className="font-bold text-white group-hover:text-[#58A6FF] transition-colors tracking-tight">{item.symbol}</div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-0.5 flex items-center gap-1">
                      <Activity size={10} /> Vol: {(Math.random() * 5 + 1).toFixed(1)}M
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-white">{item.price}</div>
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
    </div>
  );
}
