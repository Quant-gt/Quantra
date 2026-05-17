"use client";

import React from 'react';
import { Zap, Play, Pause, Trash2, Plus, Activity, AlertCircle, ShieldCheck, Cpu, ArrowUpRight, ArrowDownRight, Terminal, Clock } from 'lucide-react';

export default function DashboardAutoTradePage() {
  const bots = [
    { id: 1, name: "NIFTY_MOMENTUM_ALPHA", strategy: "Momentum Breakout", status: "ACTIVE", pnl: "+₹ 12,450.00", roi: "+5.2%", active: true, uptime: "14h 23m", latency: "12ms", target: "NSE:NIFTY50" },
    { id: 2, name: "BNF_SCALPER_HFT", strategy: "Orderbook Scalping", status: "PAUSED", pnl: "-₹ 2,100.00", roi: "-1.1%", active: false, uptime: "--", latency: "--", target: "NSE:BANKNIFTY" },
    { id: 3, name: "STRANGLE_WEEKLY_DELTA", strategy: "Options Selling", status: "ACTIVE", pnl: "+₹ 4,500.00", roi: "+1.8%", active: true, uptime: "3d 4h", latency: "18ms", target: "NSE:NIFTYW" },
  ];

  return (
    <div className="p-4 md:p-8 bg-[#0D1117] min-h-full space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-[#D29922]/10 rounded-lg border border-[#D29922]/20">
              <Terminal className="text-[#D29922]" size={28} />
            </div>
            Execution Engine
          </h1>
          <p className="text-gray-400 text-sm mt-2 max-w-xl leading-relaxed">
            Command center for your live algorithmic fleet. Monitor execution latency, real-time PnL, and system health status.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="bg-[#161B22] border border-[#30363D] px-4 py-2 rounded-lg flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#39D353] animate-pulse"></span>
              <span className="text-xs font-mono text-gray-400">SEBI OPS: 2.4/10</span>
            </div>
          </div>
          <button className="bg-[#238636] hover:bg-[#2ea043] text-white font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2 text-sm shadow-lg">
            <Plus size={16} strokeWidth={3} />
            DEPLOY NEW ALGO
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "NET P&L (TODAY)", value: "+₹ 14,850.00", positive: true },
          { label: "ACTIVE ALGOS", value: "2 / 5", positive: null },
          { label: "TOTAL TRADES", value: "142", positive: null },
          { label: "SYSTEM LATENCY", value: "15ms", positive: true, icon: <Activity size={14} /> }
        ].map((stat, i) => (
          <div key={i} className="bg-[#161B22]/50 backdrop-blur-md border border-[#30363D] rounded-xl p-5 shadow-lg">
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 flex items-center justify-between">
              {stat.label}
              {stat.icon && <span className="text-[#58A6FF]">{stat.icon}</span>}
            </div>
            <div className={`text-2xl font-mono font-bold tracking-tight ${
              stat.positive === true ? 'text-[#39D353]' : stat.positive === false ? 'text-[#F85149]' : 'text-white'
            }`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Grid of Bots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bots.map((bot) => (
          <div key={bot.id} className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-[#58A6FF]/50 transition-all">
            
            {/* Background Glow */}
            {bot.active && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#39D353]/5 blur-[50px] pointer-events-none" />
            )}

            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Cpu size={14} className={bot.active ? "text-[#58A6FF]" : "text-gray-500"} />
                    <h2 className="font-bold text-white text-lg tracking-tight group-hover:text-[#58A6FF] transition-colors">{bot.name}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider bg-[#21262D] text-gray-400 px-2 py-0.5 rounded border border-[#30363D]">
                      {bot.target}
                    </span>
                    <span className="text-xs text-gray-500">{bot.strategy}</span>
                  </div>
                </div>
                
                <span className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-sm border ${
                  bot.active ? 'bg-[#238636]/10 text-[#39D353] border-[#238636]/30' : 'bg-[#D29922]/10 text-[#D29922] border-[#D29922]/30'
                }`}>
                  {bot.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 my-6">
                <div className="bg-[#0D1117] p-3 rounded-lg border border-[#30363D]/50">
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Session P&L</div>
                  <div className={`font-bold font-mono text-lg flex items-center gap-1 ${bot.pnl.startsWith('+') ? 'text-[#39D353]' : 'text-[#F85149]'}`}>
                    {bot.pnl.startsWith('+') ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {bot.pnl.replace(/[+-]/, '')}
                  </div>
                </div>
                <div className="bg-[#0D1117] p-3 rounded-lg border border-[#30363D]/50">
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Net ROI</div>
                  <div className={`font-bold font-mono text-lg ${bot.roi.startsWith('+') ? 'text-[#39D353]' : 'text-[#F85149]'}`}>
                    {bot.roi}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#30363D]">
              <div className="flex flex-col gap-1">
                <div className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                  <Clock size={10} /> UP: {bot.uptime}
                </div>
                <div className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                  <Zap size={10} /> PING: {bot.latency}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-[#F85149] hover:bg-[#F85149]/10 rounded-lg transition-colors border border-transparent hover:border-[#F85149]/30">
                  <Trash2 size={16} />
                </button>
                {bot.active ? (
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-[#D29922]/10 text-[#D29922] hover:bg-[#D29922]/20 border border-[#D29922]/30 rounded-lg transition-colors font-bold text-xs tracking-wider">
                    <Pause size={14} fill="currentColor" /> PAUSE
                  </button>
                ) : (
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-[#238636]/10 text-[#39D353] hover:bg-[#238636]/20 border border-[#238636]/30 rounded-lg transition-colors font-bold text-xs tracking-wider">
                    <Play size={14} fill="currentColor" /> START
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Add New Bot Card */}
        <div className="border-2 border-dashed border-[#30363D] hover:border-[#58A6FF] bg-[#161B22]/30 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group min-h-[250px]">
          <div className="w-12 h-12 rounded-full bg-[#21262D] group-hover:bg-[#388BFD]/20 flex items-center justify-center mb-4 transition-colors">
            <Plus size={24} className="text-gray-400 group-hover:text-[#58A6FF] transition-colors" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#58A6FF] transition-colors">Deploy Algorithm</h3>
          <p className="text-sm text-gray-500 max-w-[200px]">Launch a new strategy from the builder or your template library.</p>
        </div>
      </div>
    </div>
  );
}
