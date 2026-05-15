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

      {/* Charts & Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Market Overview */}
        <div className="bg-[#161B22] p-6 rounded-xl border border-[#30363D] shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-gray-500" />
              <span className="font-bold text-white">Market Overview</span>
            </div>
            <span className="text-xs bg-[#21262D] text-[#39D353] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#39D353] rounded-full inline-block"></span>
              LIVE
            </span>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-[#30363D] mb-4 text-sm">
            <button className="text-white font-medium border-b-2 border-[#F78166] pb-2 px-1">Indices</button>
            <button className="text-gray-500 hover:text-white pb-2 px-1 transition-colors">Top NSE Stocks</button>
            <button className="text-gray-500 hover:text-white pb-2 px-1 transition-colors">Banking</button>
          </div>

          {/* List of Indices */}
          <div className="space-y-3 flex-1">
            <div className="flex justify-between items-center bg-[#0D1117] p-4 rounded-lg hover:bg-[#1C2128] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#21262D] rounded-lg flex items-center justify-center font-bold text-xs text-white">N</div>
                <div className="flex flex-col justify-center">
                  <div className="text-sm font-bold text-white leading-tight">NIFTY 50</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-tight">Nifty 50</div>
                </div>
              </div>
              <div className="text-right flex flex-col justify-center">
                <div className="text-sm font-bold text-white leading-tight">22,453.30</div>
                <div className="text-xs text-[#39D353] flex items-center justify-end gap-0.5 mt-0.5 leading-tight">
                  <ArrowUpRight size={12} /> +150.20 (0.67%)
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center bg-[#0D1117] p-4 rounded-lg hover:bg-[#1C2128] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#21262D] rounded-lg flex items-center justify-center font-bold text-xs text-white">S</div>
                <div className="flex flex-col justify-center">
                  <div className="text-sm font-bold text-white leading-tight">SENSEX</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-tight">Sensex</div>
                </div>
              </div>
              <div className="text-right flex flex-col justify-center">
                <div className="text-sm font-bold text-white leading-tight">74,616.58</div>
                <div className="text-xs text-[#39D353] flex items-center justify-end gap-0.5 mt-0.5 leading-tight">
                  <ArrowUpRight size={12} /> +509.73 (0.69%)
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center bg-[#0D1117] p-4 rounded-lg hover:bg-[#1C2128] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#21262D] rounded-lg flex items-center justify-center font-bold text-xs text-white">B</div>
                <div className="flex flex-col justify-center">
                  <div className="text-sm font-bold text-white leading-tight">BANKNIFTY</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-tight">Nifty Bank</div>
                </div>
              </div>
              <div className="text-right flex flex-col justify-center">
                <div className="text-sm font-bold text-white leading-tight">48,201.10</div>
                <div className="text-xs text-red-500 flex items-center justify-end gap-0.5 mt-0.5 leading-tight">
                  <ArrowDownRight size={12} /> -45.30 (-0.09%)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Portfolio Performance */}
        <div className="bg-[#161B22] p-6 rounded-xl border border-[#30363D] shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-white">Portfolio Performance</span>
            <div className="flex gap-2 text-xs bg-[#0D1117] p-1 rounded-lg">
              <button className="px-2.5 py-1 text-gray-500 hover:text-white transition-colors">1W</button>
              <button className="px-2.5 py-1 bg-[#21262D] text-white rounded transition-colors">1M</button>
              <button className="px-2.5 py-1 text-gray-500 hover:text-white transition-colors">3M</button>
              <button className="px-2.5 py-1 text-gray-500 hover:text-white transition-colors">1Y</button>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 w-full flex-1">
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
    </div>
  );
}
