"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon } from "lucide-react";

// Mock data for charts
const equityData = [
  { date: 'May 01', value: 500000 },
  { date: 'May 03', value: 512000 },
  { date: 'May 05', value: 508000 },
  { date: 'May 07', value: 525000 },
  { date: 'May 09', value: 531000 },
  { date: 'May 11', value: 542000 },
];

const strategyPnl = [
  { name: 'Nifty Scalper', pnl: 24500 },
  { name: 'BNF Trend', pnl: -4500 },
  { name: 'Crude Breakout', pnl: 12000 },
  { name: 'IT Swing', pnl: 8500 },
];

const brokerExposure = [
  { name: 'Zerodha', value: 60 },
  { name: 'Upstox', value: 25 },
  { name: 'Angel One', value: 15 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio Analytics</h1>
          <p className="text-white/60">
            Aggregate performance across all deployed strategies.
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <p className="text-xs text-white/50 mb-1">Total Capital Deployed</p>
            <p className="text-2xl font-bold text-white">₹5,00,000</p>
          </div>
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <p className="text-xs text-white/50 mb-1">Total Net P&L</p>
            <p className="text-2xl font-bold text-green-400">+₹42,000</p>
          </div>
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <p className="text-xs text-white/50 mb-1">Win Rate</p>
            <p className="text-2xl font-bold text-white">62%</p>
          </div>
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <p className="text-xs text-white/50 mb-1">Max Drawdown</p>
            <p className="text-2xl font-bold text-red-400">-4.2%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Equity Curve */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6">Combined Equity Curve</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={equityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Broker Exposure */}
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-primary" /> Broker Exposure
            </h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={brokerExposure}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {brokerExposure.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs text-white/70 mt-4">
              {brokerExposure.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strategy P&L Bar Chart */}
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6">P&L by Strategy</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={strategyPnl} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                  <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                  <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" width={100} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <Bar dataKey="pnl" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}>
                    {strategyPnl.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#10b981' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tax Report Generator Card */}
          <div className="glass-panel p-6 rounded-xl border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Tax-Ready Reports</h3>
              <p className="text-sm text-white/60 mb-6">
                Download FIFO-based capital gains reports for ITR filing.
              </p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/70">Financial Year</span>
                  <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs">
                    <option>FY 2025-26</option>
                    <option>FY 2024-25</option>
                  </select>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/70">Matching Method</span>
                  <span className="text-white font-medium">FIFO (First-In, First-Out)</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-colors text-sm">
                Generate ITR Report (PDF)
              </button>
              <p className="text-xs text-white/30 text-center mt-2">
                Consult a qualified CA. This report is for reference only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
