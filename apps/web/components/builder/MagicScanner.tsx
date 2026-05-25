"use client";

import { Sparkles, Navigation } from 'lucide-react';
import { useState } from 'react';

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
      // Mock results based on the prompt
      if (prompt.toLowerCase().includes('rsi')) {
        setResults([
          { symbol: 'RELIANCE', company: 'Reliance Industries Ltd.', price: '₹2,954.20', change: '+1.2%' },
          { symbol: 'TCS', company: 'Tata Consultancy Services', price: '₹3,845.10', change: '+0.8%' },
          { symbol: 'HDFCBANK', company: 'HDFC Bank Ltd.', price: '₹1,532.00', change: '+2.1%' }
        ]);
      } else if (prompt.toLowerCase().includes('macd')) {
        setResults([
          { symbol: 'INFY', company: 'Infosys Ltd.', price: '₹1,432.50', change: '+3.4%' },
          { symbol: 'ITC', company: 'ITC Ltd.', price: '₹423.80', change: '+0.5%' }
        ]);
      } else {
        setResults([
          { symbol: 'TATAMOTORS', company: 'Tata Motors Ltd.', price: '₹984.30', change: '+1.5%' }
        ]);
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
                onClick={() => setPrompt(chip)}
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
          <p className="text-sm font-bold animate-pulse">AI is parsing "{prompt}" and querying Nifty 500...</p>
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
                  <h4 className="text-lg font-bold text-white">{r.symbol}</h4>
                  <p className="text-xs text-gray-400">{r.company}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-cyan-400">{r.price}</p>
                  <p className="text-xs text-green-400">{r.change}</p>
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
          <p className="text-sm">Enter a magic prompt to scan the Nifty 500 universe.</p>
        </div>
      )}
    </div>
  );
}
