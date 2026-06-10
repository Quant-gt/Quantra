"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Play, Calendar, DollarSign, Cpu, ArrowUpRight, TrendingUp, ShieldAlert, Award } from 'lucide-react';
import Link from 'next/link';

export default function BacktestPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  const [asset, setAsset] = useState('NIFTY 50');
  const [strategy, setStrategy] = useState('Moving Average Crossover');
  const [capital, setCapital] = useState(1000000);

  const runBacktest = () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setResults({
            cagr: '24.8%',
            maxDrawdown: '-8.3%',
            sharpe: '2.14',
            winRate: '68.4%',
            tradesCount: 142,
            netProfit: '₹2,48,200',
            equityCurve: [1000000, 1020000, 1015000, 1050000, 1090000, 1075000, 1120000, 1180000, 1160000, 1248200]
          });
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white font-sans">
      {/* Header */}
      <nav className="border-b border-[#30363D] bg-[#161B22]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white flex items-center justify-center rounded-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Quantra</span>
          </Link>
          <div className="flex gap-4">
            <Link href="/marketplace" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Marketplace</Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Pricing</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-[#161B22] border-b border-[#30363D] relative py-16 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#388BFD]/5 to-transparent z-0 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Historical Backtester</h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
            Test and validate your quantitative trading algorithms against decades of historical tick data with lightning-fast execution.
          </p>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Parameters Panel */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-xl h-fit">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Cpu className="text-[#58A6FF]" size={20} />
            Backtest Parameters
          </h2>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Strategy</label>
              <select 
                value={strategy}
                onChange={e => setStrategy(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-white text-sm focus:border-[#58A6FF] outline-none"
              >
                <option>Moving Average Crossover</option>
                <option>RSI Mean Reversion</option>
                <option>Bollinger Band Breakout</option>
                <option>Custom Pine Script Strategy</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Asset</label>
              <select 
                value={asset}
                onChange={e => setAsset(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-white text-sm focus:border-[#58A6FF] outline-none"
              >
                <option>NIFTY 50</option>
                <option>BANKNIFTY</option>
                <option>RELIANCE</option>
                <option>TATASTEEL</option>
                <option>SUZLON</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Initial Capital (INR)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                <input 
                  type="number" 
                  value={capital}
                  onChange={e => setCapital(Number(e.target.value))}
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl pl-8 pr-4 py-3 text-white text-sm focus:border-[#58A6FF] outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Start Date</label>
                <input 
                  type="date" 
                  defaultValue="2025-01-01"
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-white text-xs focus:border-[#58A6FF] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">End Date</label>
                <input 
                  type="date" 
                  defaultValue="2026-05-29"
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-white text-xs focus:border-[#58A6FF] outline-none"
                />
              </div>
            </div>

            <button 
              onClick={runBacktest}
              disabled={isRunning}
              className={`w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${isRunning ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-[#238636] hover:bg-[#2ea043] text-white active:scale-[0.98]'}`}
            >
              <Play size={16} fill="currentColor" /> {isRunning ? 'Running Simulation...' : 'Run Backtest'}
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-2 bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-xl flex flex-col min-h-[400px]">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <BarChart2 className="text-[#58A6FF]" size={20} />
            Backtest Results
          </h2>

          {isRunning && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
              <div className="text-sm font-mono text-emerald-400 font-bold mb-2">Simulating trades... {progress}%</div>
              <div className="w-48 bg-[#0D1117] h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full transition-all duration-150" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {!isRunning && !results && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-[#30363D] rounded-xl">
              <Award className="text-gray-600 mb-4" size={48} />
              <p className="text-gray-400 font-bold text-sm">No Results Available</p>
              <p className="text-gray-500 text-xs mt-1">Configure parameters and click "Run Backtest" to generate performance metrics.</p>
            </div>
          )}

          {!isRunning && results && (
            <div className="flex-1 flex flex-col gap-6">
              {/* Performance Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0D1117] border border-[#30363D] p-4 rounded-xl">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">CAGR</div>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{results.cagr}</div>
                </div>
                <div className="bg-[#0D1117] border border-[#30363D] p-4 rounded-xl">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Max Drawdown</div>
                  <div className="text-xl font-bold font-mono text-red-400 mt-1">{results.maxDrawdown}</div>
                </div>
                <div className="bg-[#0D1117] border border-[#30363D] p-4 rounded-xl">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Sharpe Ratio</div>
                  <div className="text-xl font-bold font-mono text-cyan-400 mt-1">{results.sharpe}</div>
                </div>
                <div className="bg-[#0D1117] border border-[#30363D] p-4 rounded-xl">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Win Rate</div>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{results.winRate}</div>
                </div>
              </div>

              {/* Extra Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0D1117]/50 border border-[#30363D] px-6 py-4 rounded-xl flex justify-between items-center">
                  <span className="text-sm text-gray-400">Net Profit</span>
                  <span className="font-bold font-mono text-emerald-400 text-lg">{results.netProfit}</span>
                </div>
                <div className="bg-[#0D1117]/50 border border-[#30363D] px-6 py-4 rounded-xl flex justify-between items-center">
                  <span className="text-sm text-gray-400">Total Trades</span>
                  <span className="font-bold font-mono text-white text-lg">{results.tradesCount}</span>
                </div>
              </div>

              {/* Equity Curve Visualizer */}
              <div className="flex-1 bg-[#0D1117] border border-[#30363D] rounded-xl p-4 flex flex-col justify-end min-h-[200px]">
                <div className="text-xs text-gray-500 font-bold mb-4 uppercase tracking-wider">Simulated Equity Curve (₹)</div>
                <div className="flex items-end gap-1.5 h-32 w-full pt-4">
                  {results.equityCurve.map((val: number, i: number) => {
                    const percent = ((val - 980000) / 280000) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                        <div className="absolute bottom-full mb-1 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono pointer-events-none z-10">
                          ₹{val.toLocaleString('en-IN')}
                        </div>
                        <div 
                          className="bg-emerald-500/80 hover:bg-emerald-400 w-full rounded-t transition-all duration-300"
                          style={{ height: `${Math.max(10, percent)}%` }}
                        ></div>
                        <span className="text-[9px] text-gray-600 font-mono mt-1">T{i+1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

