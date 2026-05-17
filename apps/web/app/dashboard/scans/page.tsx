"use client";

import React from 'react';
import { SlidersHorizontal, Play, Trash2, Plus, Clock, Search, Activity, Zap, CheckCircle2, FileText, ChevronRight } from 'lucide-react';

export default function DashboardScansPage() {
  const scans = [
    { id: 1, name: "Intraday Breakout (High Volume)", criteria: ["Volume > 2x 10d Avg", "CMP > R1 Pivot", "RSI(14) > 60"], stocks: 12, frequency: "Every 15 Min", status: "Active", lastRun: "10 mins ago" },
    { id: 2, name: "Deep Oversold Rebound", criteria: ["RSI(14) < 30", "Price < Lower Bollinger Band", "MACD Histogram Rising"], stocks: 5, frequency: "Manual", status: "Idle", lastRun: "Yesterday" },
    { id: 3, name: "Golden Cross Swing", criteria: ["EMA(50) crosses above EMA(200)", "Daily Volume > 1M"], stocks: 28, frequency: "Daily (EOD)", status: "Active", lastRun: "2 hours ago" },
  ];

  return (
    <div className="p-4 md:p-8 bg-[#0D1117] min-h-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-[#58A6FF]/10 rounded-lg border border-[#58A6FF]/20">
              <SlidersHorizontal className="text-[#58A6FF]" size={28} />
            </div>
            Custom Scanners
          </h1>
          <p className="text-gray-400 text-sm mt-2 max-w-xl leading-relaxed">
            Automated market screening. Define complex technical parameters to filter the Nifty 500 universe in real-time or on a schedule.
          </p>
        </div>

        <button className="bg-[#238636] hover:bg-[#2ea043] text-white font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2 text-sm shadow-lg">
          <Plus size={16} strokeWidth={3} />
          CREATE SCANNER
        </button>
      </div>

      {/* Stats/Toolbar */}
      <div className="bg-[#161B22]/80 backdrop-blur-xl border border-[#30363D] rounded-xl p-4 flex justify-between items-center shadow-lg">
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#21262D] border border-[#30363D] flex items-center justify-center">
              <Activity size={18} className="text-[#58A6FF]" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Active Scans</div>
              <div className="text-white font-bold font-mono">2 / 10</div>
            </div>
          </div>
          <div className="w-px h-8 bg-[#30363D]"></div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#21262D] border border-[#30363D] flex items-center justify-center">
              <Zap size={18} className="text-[#D29922]" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">API Limit</div>
              <div className="text-white font-bold font-mono">45% Used</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={14} />
          <input 
            type="text" 
            placeholder="Find scanner..." 
            className="w-64 bg-[#0D1117] border border-[#30363D] text-white text-xs rounded-md pl-9 pr-3 py-2 outline-none focus:border-[#58A6FF] transition-colors"
          />
        </div>
      </div>

      {/* Scanner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {scans.map((scan) => (
          <div key={scan.id} className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 flex flex-col justify-between shadow-xl group hover:border-[#58A6FF]/40 transition-colors relative overflow-hidden">
            
            {scan.status === 'Active' && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#58A6FF]/5 blur-[40px] pointer-events-none" />
            )}

            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="font-bold text-white text-lg group-hover:text-[#58A6FF] transition-colors flex items-center gap-2 tracking-tight">
                    {scan.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-[#388BFD]/10 text-[#58A6FF] px-2 py-0.5 rounded border border-[#388BFD]/30">
                      {scan.stocks} MATCHES
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} /> {scan.frequency}
                    </span>
                  </div>
                </div>
                
                {scan.status === 'Active' ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase bg-[#238636]/10 text-[#39D353] px-2 py-1 rounded border border-[#238636]/30">
                    <CheckCircle2 size={12} /> ACTIVE
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase bg-[#21262D] text-gray-400 px-2 py-1 rounded border border-[#30363D]">
                    IDLE
                  </span>
                )}
              </div>

              <div className="bg-[#0D1117] p-4 rounded-lg border border-[#30363D]/50 mb-6">
                <div className="text-[10px] text-gray-500 mb-2 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <FileText size={12} /> SCAN CRITERIA
                </div>
                <div className="space-y-1.5">
                  {scan.criteria.map((c, i) => (
                    <div key={i} className="text-xs text-gray-300 font-mono flex gap-2">
                      <span className="text-[#58A6FF]">{(i + 1).toString().padStart(2, '0')}</span>
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#30363D]">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                LAST RUN: {scan.lastRun}
              </div>
              <div className="flex justify-end items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-[#F85149] hover:bg-[#F85149]/10 rounded-lg transition-colors border border-transparent hover:border-[#F85149]/30">
                  <Trash2 size={16} />
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-[#1C2128] hover:bg-[#21262D] text-white rounded-lg text-xs font-bold transition-all border border-[#30363D] hover:border-[#8B949E] shadow-sm">
                  <Play size={14} fill="currentColor" className="text-[#39D353]" />
                  EXECUTE
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Create New Scan Card */}
        <div className="border-2 border-dashed border-[#30363D] hover:border-[#58A6FF] bg-[#161B22]/30 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group min-h-[250px]">
          <div className="w-12 h-12 rounded-full bg-[#21262D] group-hover:bg-[#388BFD]/20 flex items-center justify-center mb-4 transition-colors">
            <SlidersHorizontal size={24} className="text-gray-400 group-hover:text-[#58A6FF] transition-colors" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#58A6FF] transition-colors">Create New Scanner</h3>
          <p className="text-sm text-gray-500 max-w-[200px]">Use the visual builder to create complex filtering logic.</p>
        </div>
      </div>
    </div>
  );
}
