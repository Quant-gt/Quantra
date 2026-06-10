"use client";

import React, { useState } from 'react';
import { History, Play, Loader2, Target, TrendingUp, TrendingDown, AlertTriangle, Activity, Calendar } from 'lucide-react';

export default function BacktestingEnginePage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleRunBacktest = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    // Simulate backend backtest engine processing
    setTimeout(() => {
      setResults({
        metrics: {
          totalReturn: 142.5,
          winRate: 68.4,
          maxDrawdown: 12.3,
          sharpeRatio: 1.85,
          totalTrades: 245,
          profitFactor: 2.1
        },
        trades: [
          { id: 1, date: '2026-06-04 14:15', type: 'LONG', asset: 'NIFTY 50', entry: 23450.00, exit: 23510.50, pnl: 3025.00 },
          { id: 2, date: '2026-06-04 10:30', type: 'SHORT', asset: 'NIFTY 50', entry: 23380.00, exit: 23350.25, pnl: 1487.50 },
          { id: 3, date: '2026-06-03 15:00', type: 'LONG', asset: 'NIFTY 50', entry: 23200.00, exit: 23150.00, pnl: -2500.00 },
          { id: 4, date: '2026-06-03 09:45', type: 'LONG', asset: 'NIFTY 50', entry: 23110.00, exit: 23180.00, pnl: 3500.00 },
          { id: 5, date: '2026-06-02 13:20', type: 'SHORT', asset: 'NIFTY 50', entry: 23050.00, exit: 23100.00, pnl: -2500.00 }
        ]
      });
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
          <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
            <History className="text-orange-500" size={28} />
          </div>
          Backtesting Engine
        </h1>
        <p className="text-gray-400 mt-2 max-w-2xl">
          Simulate algorithmic strategies against historical tick data to validate performance and risk metrics before publishing to the marketplace.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-xl sticky top-6">
            <h2 className="text-lg font-bold text-white mb-6 border-b border-[#30363D] pb-3">Test Configuration</h2>
            
            <form onSubmit={handleRunBacktest} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Target Strategy</label>
                <select className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-2.5 text-white focus:border-orange-500 outline-none transition-colors appearance-none">
                  <option>AI-GEN-X7Y9Z (Mean Reversion)</option>
                  <option>Momentum Breakout v2</option>
                  <option>Options Scalper PRO</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Instrument</label>
                <select className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-2.5 text-white focus:border-orange-500 outline-none transition-colors appearance-none">
                  <option>NIFTY 50 Index</option>
                  <option>BANKNIFTY Index</option>
                  <option>RELIANCE.NS</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Timeframe</label>
                  <select className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-2.5 text-white focus:border-orange-500 outline-none transition-colors appearance-none">
                    <option>5 Minute</option>
                    <option>15 Minute</option>
                    <option>1 Hour</option>
                    <option>1 Day</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Capital</label>
                  <input type="text" defaultValue="₹5,00,000" className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-2.5 text-white focus:border-orange-500 outline-none transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Historical Range</label>
                <div className="flex items-center gap-2">
                  <input type="date" defaultValue="2025-01-01" className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-2.5 text-gray-300 focus:border-orange-500 outline-none transition-colors text-sm" />
                  <span className="text-gray-500">to</span>
                  <input type="date" defaultValue="2026-06-01" className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-2.5 text-gray-300 focus:border-orange-500 outline-none transition-colors text-sm" />
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-[#30363D]">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-orange-900/20"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={20} /> Compiling Data...</>
                  ) : (
                    <><Play size={20} className="fill-current" /> Run Full Backtest</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-2 space-y-6">
          {loading && (
            <div className="h-64 border border-[#30363D] bg-[#161B22]/50 rounded-2xl flex flex-col items-center justify-center text-gray-400 animate-pulse">
              <Activity size={48} className="mb-4 text-orange-500/50" />
              <p>Simulating tick data over 18 months...</p>
            </div>
          )}

          {!loading && !results && (
            <div className="h-64 border border-[#30363D] border-dashed rounded-2xl flex flex-col items-center justify-center text-gray-500">
              <History size={48} className="mb-4 opacity-50" />
              <p>Select a strategy and run backtest to see results</p>
            </div>
          )}

          {results && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <TrendingUp size={14} className="text-[#39D353]" /> Total Return
                  </div>
                  <div className="text-2xl font-black text-white">+{results.metrics.totalReturn}%</div>
                </div>
                <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Target size={14} className="text-[#58A6FF]" /> Win Rate
                  </div>
                  <div className="text-2xl font-black text-white">{results.metrics.winRate}%</div>
                </div>
                <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <AlertTriangle size={14} className="text-[#F85149]" /> Max Drawdown
                  </div>
                  <div className="text-2xl font-black text-[#F85149]">-{results.metrics.maxDrawdown}%</div>
                </div>
                <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
                  <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Sharpe Ratio</div>
                  <div className="text-xl font-bold text-white">{results.metrics.sharpeRatio}</div>
                </div>
                <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
                  <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Total Trades</div>
                  <div className="text-xl font-bold text-white">{results.metrics.totalTrades}</div>
                </div>
                <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
                  <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Profit Factor</div>
                  <div className="text-xl font-bold text-white">{results.metrics.profitFactor}</div>
                </div>
              </div>

              {/* Mock Equity Curve Chart */}
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
                <h3 className="font-bold text-white mb-6">Equity Curve</h3>
                <div className="h-48 w-full bg-gradient-to-t from-orange-500/10 to-transparent border-b-2 border-orange-500 relative flex items-end">
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0,100 L0,80 L10,75 L20,85 L30,60 L40,65 L50,40 L60,45 L70,20 L80,30 L90,10 L100,5 L100,100 Z" fill="url(#gradient)" opacity="0.3" />
                    <path d="M0,80 L10,75 L20,85 L30,60 L40,65 L50,40 L60,45 L70,20 L80,30 L90,10 L100,5" fill="none" stroke="#f97316" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Trade Log */}
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
                <div className="p-4 border-b border-[#30363D] bg-[#0D1117]/50">
                  <h3 className="font-bold text-white">Execution Log (Sample)</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 bg-[#0D1117] uppercase font-mono">
                      <tr>
                        <th className="px-6 py-3 border-b border-[#30363D]">Date/Time</th>
                        <th className="px-6 py-3 border-b border-[#30363D]">Type</th>
                        <th className="px-6 py-3 border-b border-[#30363D]">Asset</th>
                        <th className="px-6 py-3 border-b border-[#30363D]">Entry</th>
                        <th className="px-6 py-3 border-b border-[#30363D]">Exit</th>
                        <th className="px-6 py-3 border-b border-[#30363D] text-right">PnL (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#30363D]">
                      {results.trades.map((trade: any) => (
                        <tr key={trade.id} className="hover:bg-[#1C2128] transition-colors">
                          <td className="px-6 py-4 text-gray-400 font-mono text-xs flex items-center gap-2">
                            <Calendar size={12} /> {trade.date}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                              trade.type === 'LONG' ? 'bg-[#39D353]/10 text-[#39D353] border border-[#39D353]/20' : 'bg-[#F85149]/10 text-[#F85149] border border-[#F85149]/20'
                            }`}>
                              {trade.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-white font-medium">{trade.asset}</td>
                          <td className="px-6 py-4 text-gray-300 font-mono">{trade.entry.toFixed(2)}</td>
                          <td className="px-6 py-4 text-gray-300 font-mono">{trade.exit.toFixed(2)}</td>
                          <td className={`px-6 py-4 text-right font-mono font-bold ${
                            trade.pnl >= 0 ? 'text-[#39D353]' : 'text-[#F85149]'
                          }`}>
                            {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

