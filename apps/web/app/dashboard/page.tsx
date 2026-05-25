"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Globe, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const data = [
  { name: '9 Mar', value: 90000 },
  { name: '12 Mar', value: 92000 },
  { name: '17 Mar', value: 88000 },
  { name: '20 Mar', value: 91000 },
  { name: '25 Mar', value: 89000 },
  { name: '30 Mar', value: 93000 },
  { name: '2 Apr', value: 92000 },
  { name: '7 Apr', value: 94297 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Portfolio Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time overview of your trading portfolio</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-[#161B22] p-6 rounded-xl border border-[#30363D] shadow-sm">
          <div className="text-xs font-semibold text-gray-500 mb-2 tracking-wider">TOTAL INVESTMENT</div>
          <div className="text-2xl font-bold text-white">₹92,805</div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#161B22] p-6 rounded-xl border border-[#30363D] shadow-sm">
          <div className="text-xs font-semibold text-gray-500 mb-2 tracking-wider">CURRENT VALUE</div>
          <div className="text-2xl font-bold text-white">₹94,297</div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#161B22] p-6 rounded-xl border border-[#30363D] shadow-sm">
          <div className="text-xs font-semibold text-gray-500 mb-2 tracking-wider">DAY'S P&L</div>
          <div className="text-2xl font-bold text-[#39D353] flex items-baseline gap-2">
            +₹1,132
            <span className="text-sm font-medium">▲ 1.20%</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#161B22] p-6 rounded-xl border border-[#30363D] shadow-sm">
          <div className="text-xs font-semibold text-gray-500 mb-2 tracking-wider">OVERALL P&L</div>
          <div className="text-2xl font-bold text-[#39D353] flex items-baseline gap-2">
            +₹1,492
            <span className="text-sm font-medium">▲ 1.61%</span>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Column: Heatmap & Equity Curve */}
        <div className="lg:col-span-2 space-y-6">
          {/* PnL Heatmap */}
          <div className="bg-[#161B22] p-6 rounded-xl border border-[#30363D] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-white">Daily P&L Heatmap</span>
              <span className="text-xs text-gray-400">Last 90 Days</span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {Array.from({ length: 90 }).map((_, i) => {
                // Generate a mock distribution of days: 55% win, 45% loss, varying intensities
                const rand = Math.random();
                let colorClass = "bg-[#21262D]"; // Neutral/No Trade
                if (rand > 0.45) {
                  // Win
                  if (rand > 0.8) colorClass = "bg-[#39D353]"; // Big Win
                  else if (rand > 0.6) colorClass = "bg-[#2EA043]"; // Solid Win
                  else colorClass = "bg-[#0E4429]"; // Small Win
                } else if (rand > 0.05) {
                  // Loss
                  if (rand < 0.15) colorClass = "bg-[#F85149]"; // Big Loss
                  else colorClass = "bg-[#DA3633]"; // Solid Loss
                }
                
                return (
                  <div 
                    key={i} 
                    className={`w-4 h-4 rounded-sm ${colorClass} hover:ring-2 ring-white/50 cursor-pointer transition-all`}
                    title="Hover for daily PnL"
                  ></div>
                );
              })}
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 justify-end">
              <span>Less</span>
              <div className="w-3 h-3 rounded-sm bg-[#F85149]"></div>
              <div className="w-3 h-3 rounded-sm bg-[#DA3633]"></div>
              <div className="w-3 h-3 rounded-sm bg-[#21262D]"></div>
              <div className="w-3 h-3 rounded-sm bg-[#0E4429]"></div>
              <div className="w-3 h-3 rounded-sm bg-[#2EA043]"></div>
              <div className="w-3 h-3 rounded-sm bg-[#39D353]"></div>
              <span>More</span>
            </div>
          </div>

          {/* Equity Curve (Re-using existing chart code) */}
          <div className="bg-[#161B22] p-6 rounded-xl border border-[#30363D] shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-white">Cumulative Equity Curve</span>
              <div className="flex gap-2 text-xs bg-[#0D1117] p-1 rounded-lg">
                <button className="px-2.5 py-1 text-gray-500 hover:text-white transition-colors">1W</button>
                <button className="px-2.5 py-1 bg-[#21262D] text-white rounded transition-colors">1M</button>
                <button className="px-2.5 py-1 text-gray-500 hover:text-white transition-colors">3M</button>
                <button className="px-2.5 py-1 text-gray-500 hover:text-white transition-colors">1Y</button>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#388BFD" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#388BFD" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#5C6C7C" style={{ fontSize: '10px' }} tickLine={false} />
                  <YAxis stroke="#5C6C7C" style={{ fontSize: '10px' }} domain={['dataMin - 2000', 'dataMax + 2000']} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#8B949E' }}
                    itemStyle={{ color: '#FFFFFF' }}
                    cursor={{ stroke: '#30363D' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#388BFD" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Advanced Stats & Live Market */}
        <div className="space-y-6">
          {/* Win/Loss Stats */}
          <div className="bg-[#161B22] p-6 rounded-xl border border-[#30363D] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-white">Performance Metrics</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#30363D]">
                <span className="text-sm text-gray-400">Win Rate</span>
                <span className="font-mono font-bold text-[#39D353]">68.5%</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#30363D]">
                <span className="text-sm text-gray-400">Total Trades</span>
                <span className="font-mono font-bold text-white">142</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#30363D]">
                <span className="text-sm text-gray-400">Profit Factor</span>
                <span className="font-mono font-bold text-white">2.4</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#30363D]">
                <span className="text-sm text-gray-400">Max Drawdown</span>
                <span className="font-mono font-bold text-[#F85149]">-4.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Sharpe Ratio</span>
                <span className="font-mono font-bold text-white">1.8</span>
              </div>
            </div>
          </div>

          {/* Live Market (Re-using old component logic slightly condensed) */}
          <div className="bg-[#161B22] p-6 rounded-xl border border-[#30363D] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-gray-500" />
                <span className="font-bold text-white">Market</span>
              </div>
              <span className="text-xs bg-[#21262D] text-[#39D353] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#39D353] rounded-full inline-block animate-pulse"></span>
                LIVE
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold text-white">NIFTY 50</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">22,453.30</div>
                  <div className="text-xs text-[#39D353] flex items-center justify-end gap-0.5">
                    <ArrowUpRight size={12} /> +0.67%
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold text-white">BANKNIFTY</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">48,201.10</div>
                  <div className="text-xs text-[#F85149] flex items-center justify-end gap-0.5">
                    <ArrowDownRight size={12} /> -0.09%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
