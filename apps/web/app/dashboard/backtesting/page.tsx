"use client";

import React, { useState, useEffect } from 'react';
import { History, Play, Download, Trash2, LineChart, CheckCircle2, ChevronRight, Activity, Filter, Search } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

export default function DashboardBacktestingPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/backtest')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        toast.error("Failed to fetch backtests");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading simulations...</div>;

  const hasData = data?.hasData;
  const runs = data?.runs || [];

  return (
    <div className="p-4 md:p-8 bg-[#0D1117] min-h-full space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-[#8957E5]/10 rounded-lg border border-[#8957E5]/20">
              <History className="text-[#8957E5]" size={28} />
            </div>
            Simulation Engine
          </h1>
          <p className="text-gray-400 text-sm mt-2 max-w-xl leading-relaxed">
            Historical backtesting environment. Validate alpha generation capabilities against tick-level historical data.
          </p>
        </div>

        <button className="bg-[#238636] hover:bg-[#2ea043] text-white font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2 text-sm shadow-lg">
          <Play size={16} strokeWidth={3} fill="currentColor" />
          START SIMULATION
        </button>
      </div>

      {!hasData ? (
        <div className="bg-[#161B22]/80 border border-[#30363D] rounded-xl p-12 flex flex-col items-center justify-center text-center shadow-2xl">
          <div className="w-16 h-16 bg-[#8957E5]/10 rounded-full flex items-center justify-center mb-4 border border-[#8957E5]/20">
            <History size={28} className="text-[#8957E5]" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Simulations Run</h2>
          <p className="text-gray-400 max-w-md text-sm leading-relaxed mb-6">
            You haven't run any historical backtests yet. Start a new simulation to test your algorithms against years of tick-level market data.
          </p>
          <button className="px-6 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg text-sm font-bold transition-all shadow-lg flex items-center gap-2">
            <Play size={16} fill="currentColor" /> Start First Simulation
          </button>
        </div>
      ) : (
        <>
          {/* Aggregate Overview Chart */}
          <div className="bg-[#161B22]/80 backdrop-blur-xl border border-[#30363D] rounded-xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                  <LineChart size={16} className="text-[#58A6FF]" />
                  AGGREGATE PORTFOLIO EQUITY
                </h2>
                <p className="text-xs text-gray-500 mt-1">Hypothetical growth of ₹1,000,000 across top strategies</p>
              </div>
              <div className="text-2xl font-mono font-bold text-[#39D353] tracking-tight">
                {runs[0]?.cagr || '0.00%'} <span className="text-sm text-gray-500 font-sans tracking-normal ml-1">CAGR</span>
              </div>
            </div>

            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={runs[0]?.equityCurve || []} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReturn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8957E5" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8957E5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363D" vertical={false} />
                  <XAxis dataKey="name" stroke="#8b949e" tick={{ fill: '#8b949e', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#8b949e" tick={{ fill: '#8b949e', fontSize: 10, fontFamily: 'monospace' }} tickFormatter={(val) => `${val}%`} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                    labelStyle={{ color: '#8b949e', fontSize: '12px', fontFamily: 'monospace', marginBottom: '4px' }}
                    itemStyle={{ color: '#fff', fontSize: '14px', fontFamily: 'monospace', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#8957E5" fillOpacity={1} fill="url(#colorReturn)" strokeWidth={3} activeDot={{ r: 6, fill: '#8957E5', stroke: '#0D1117', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Backtest Logs */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl shadow-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#30363D] bg-[#0D1117] flex justify-between items-center">
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-gray-500" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search simulations..." 
                    className="w-64 bg-[#161B22] border border-[#30363D] text-white text-xs rounded-md pl-9 pr-3 py-2 outline-none focus:border-[#58A6FF] transition-colors"
                  />
                </div>
                <button className="bg-[#1C2128] border border-[#30363D] hover:bg-[#21262D] rounded-md px-3 py-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold">
                  <Filter size={14} /> FILTERS
                </button>
              </div>
              <div className="text-xs text-gray-500 font-mono">
                TOTAL LOGS: {runs.length}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-[#1C2128]/50 border-b border-[#30363D]">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Strategy Identity</th>
                    <th scope="col" className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Data Horizon</th>
                    <th scope="col" className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">CAGR</th>
                    <th scope="col" className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Sharpe</th>
                    <th scope="col" className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Max DD</th>
                    <th scope="col" className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                    <th scope="col" className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363D]/50">
                  {runs.map((run: any) => (
                    <tr key={run.id} className="hover:bg-[#1C2128] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white group-hover:text-[#58A6FF] transition-colors flex items-center gap-2">
                          {run.symbol}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{run.strategy}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300 font-mono">{run.period}</div>
                        <div className="text-[10px] text-gray-600 mt-1">{run.timeframe}</div>
                      </td>
                      <td className={`px-6 py-4 text-right font-mono font-bold ${run.cagr.startsWith('+') || parseFloat(run.cagr) > 0 ? 'text-[#39D353]' : 'text-gray-500'}`}>
                        {run.cagr}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-white">
                        {run.sharpe}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-[#F85149]">
                        {run.drawdown}
                      </td>
                      <td className="px-6 py-4">
                        {run.status === 'Completed' ? (
                          <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase bg-[#238636]/10 text-[#39D353] px-2.5 py-1 rounded w-max border border-[#238636]/30">
                            <CheckCircle2 size={12} />
                            COMPLETED
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase bg-[#D29922]/10 text-[#D29922] px-2.5 py-1 rounded w-max border border-[#D29922]/30">
                            <Activity size={12} className="animate-pulse" />
                            RUNNING...
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end opacity-50 group-hover:opacity-100 transition-opacity">
                          {run.status === 'Completed' && (
                            <button className="p-2 text-gray-400 hover:text-white hover:bg-[#30363D] rounded-lg transition-colors border border-transparent hover:border-[#30363D]">
                              <Download size={16} />
                            </button>
                          )}
                          <button className="p-2 text-gray-400 hover:text-[#F85149] hover:bg-[#F85149]/10 rounded-lg transition-colors border border-transparent hover:border-[#F85149]/30">
                            <Trash2 size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-[#58A6FF] hover:bg-[#58A6FF]/10 rounded-lg transition-colors border border-transparent hover:border-[#58A6FF]/30">
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

