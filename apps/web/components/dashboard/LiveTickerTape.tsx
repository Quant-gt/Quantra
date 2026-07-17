"use client";

import { useEffect, useState, useRef } from 'react';
import { feed, Tick } from '@/lib/engine/feed';
import { TrendingUp, TrendingDown } from 'lucide-react';

const INITIAL_SYMBOLS = ['NIFTY 50', 'BANKNIFTY', 'RELIANCE', 'HDFC BANK', 'TCS', 'INFY'];

export default function LiveTickerTape() {
  const [ticks, setTicks] = useState<Record<string, Tick>>({});
  
  // Throttle references
  const pendingTicks = useRef<Record<string, Tick>>({});
  const lastRenderTime = useRef<number>(Date.now());

  useEffect(() => {
    // Pre-populate with initial fake values so the bar isn't empty on load
    const initial: Record<string, Tick> = {};
    INITIAL_SYMBOLS.forEach(sym => {
      initial[sym] = {
        symbol: sym,
        price: 0,
        change: 0,
        changePct: 0,
        direction: 'none',
        timestamp: Date.now()
      };
    });
    setTicks(initial);

    const handleTick = (tick: Tick) => {
      // 1. Queue the incoming tick
      pendingTicks.current[tick.symbol] = tick;

      // 2. Throttle DOM updates to once every 500ms
      const now = Date.now();
      if (now - lastRenderTime.current > 500) {
        // Capture current pending ticks before clearing
        const ticksToApply = { ...pendingTicks.current };
        
        setTicks(prev => {
          // Merge captured ticks into state
          const nextState = { ...prev };
          Object.keys(ticksToApply).forEach(sym => {
            nextState[sym] = ticksToApply[sym]!;
          });
          return nextState;
        });
        
        // Clear pending queue and reset timer
        pendingTicks.current = {};
        lastRenderTime.current = now;
      }
    };

    const unsubscribe = feed.subscribe(handleTick);
    return () => unsubscribe();
  }, []);

  const [isPaperTrading, setIsPaperTrading] = useState(true);

  return (
    <div className="bg-[#161B22] border-b border-[#30363D] p-3 text-xs flex flex-wrap items-center justify-between gap-6 overflow-hidden">
      <div className="flex items-center gap-6">
        {INITIAL_SYMBOLS.map(symbol => {
          const tick = ticks[symbol];
          if (!tick || tick.price === 0) return <span key={symbol} className="text-gray-500 animate-pulse">{symbol} Loading...</span>;

          const isUp = tick.direction === 'up';
          const isDown = tick.direction === 'down';
          
          return (
            <span 
              key={symbol} 
              className="font-medium flex items-center gap-1 transition-colors duration-300"
            >
              <span className="w-4 h-4 bg-[#1F2937] rounded-full inline-flex items-center justify-center text-[10px] leading-none text-gray-400">
                {symbol[0]}
              </span>
              <span className="text-white">{symbol}</span>
              <span className={isUp ? "text-green-400" : isDown ? "text-red-400" : "text-gray-400"}>
                {tick.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className={`flex items-center text-[10px] ${isUp ? "text-green-500" : isDown ? "text-red-500" : "text-gray-500"}`}>
                {isUp ? <TrendingUp size={10} className="mr-0.5" /> : isDown ? <TrendingDown size={10} className="mr-0.5" /> : null}
                {tick.change > 0 ? "+" : ""}{tick.change} ({tick.changePct > 0 ? "+" : ""}{tick.changePct}%)
              </span>
            </span>
          );
        })}
      </div>

      {/* Paper Trading Toggle */}
      <div className="flex items-center gap-3 bg-[#0D1117] px-3 py-1.5 rounded-full border border-[#30363D]">
        <span className={`text-xs font-bold ${isPaperTrading ? 'text-[#388BFD]' : 'text-gray-500'}`}>
          PAPER
        </span>
        <button 
          onClick={() => setIsPaperTrading(!isPaperTrading)}
          className={`w-10 h-5 rounded-full relative transition-colors ${isPaperTrading ? 'bg-[#388BFD]' : 'bg-[#F85149]'}`}
        >
          <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${isPaperTrading ? 'left-1' : 'left-5'}`}></div>
        </button>
        <span className={`text-xs font-bold ${!isPaperTrading ? 'text-[#F85149]' : 'text-gray-500'}`}>
          LIVE
        </span>
      </div>
    </div>
  );
}
