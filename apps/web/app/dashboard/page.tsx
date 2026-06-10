"use client";

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Globe, ArrowUpRight, ArrowDownRight, Activity, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/portfolio')
      .then(res => res.json())
      .then(data => {
        setPortfolio(data);
        setLoading(false);
      })
      .catch(err => {
        toast.error("Failed to load portfolio data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading portfolio...</div>;
  }

  const hasData = portfolio?.hasData;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Portfolio Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time overview of your trading portfolio</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#161B22] p-6 rounded-xl border border-[#30363D] shadow-sm">
          <div className="text-xs font-semibold text-gray-500 mb-2 tracking-wider">TOTAL INVESTMENT</div>
          <div className="text-2xl font-bold text-white">₹{portfolio?.totalInvestment.toLocaleString() || '0.00'}</div>
        </div>

        <div className="bg-[#161B22] p-6 rounded-xl border border-[#30363D] shadow-sm">
          <div className="text-xs font-semibold text-gray-500 mb-2 tracking-wider">CURRENT VALUE</div>
          <div className="text-2xl font-bold text-white">₹{portfolio?.currentValue.toLocaleString() || '0.00'}</div>
        </div>

        <div className="bg-[#161B22] p-6 rounded-xl border border-[#30363D] shadow-sm">
          <div className="text-xs font-semibold text-gray-500 mb-2 tracking-wider">DAY'S P&L</div>
          <div className={`text-2xl font-bold flex items-baseline gap-2 ${portfolio?.dayPnl.amount >= 0 ? 'text-[#39D353]' : 'text-gray-500'}`}>
            {portfolio?.dayPnl.amount >= 0 ? '+' : ''}₹{portfolio?.dayPnl.amount.toLocaleString() || '0.00'}
            <span className="text-sm font-medium">{portfolio?.dayPnl.pct.toFixed(2)}%</span>
          </div>
        </div>

        <div className="bg-[#161B22] p-6 rounded-xl border border-[#30363D] shadow-sm">
          <div className="text-xs font-semibold text-gray-500 mb-2 tracking-wider">OVERALL P&L</div>
          <div className={`text-2xl font-bold flex items-baseline gap-2 ${portfolio?.overallPnl.amount >= 0 ? (hasData ? 'text-[#39D353]' : 'text-gray-500') : 'text-[#F85149]'}`}>
            {portfolio?.overallPnl.amount > 0 ? '+' : ''}₹{portfolio?.overallPnl.amount.toLocaleString() || '0.00'}
            <span className="text-sm font-medium">{portfolio?.overallPnl.pct.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {!hasData ? (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-[#21262D] rounded-full flex items-center justify-center mb-4 border border-[#30363D]">
            <TrendingUp size={28} className="text-[#388BFD]" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Trading History Yet</h2>
          <p className="text-gray-400 max-w-md text-sm leading-relaxed mb-6">
            Your portfolio dashboard will automatically populate with real-time analytics, heatmaps, and equity curves once your deployed algorithms begin executing trades on your connected broker.
          </p>
          <a href="/marketplace" className="px-6 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg text-sm font-bold transition-all shadow-lg flex items-center gap-2">
            <Activity size={16} /> Deploy Your First Algorithm
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Equity Curve */}
            <div className="bg-[#161B22] p-6 rounded-xl border border-[#30363D] shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-white">Cumulative Equity Curve</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={portfolio.equityCurve} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#388BFD" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#388BFD" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#5C6C7C" style={{ fontSize: '10px' }} tickLine={false} />
                    <YAxis stroke="#5C6C7C" style={{ fontSize: '10px' }} tickLine={false} axisLine={false} />
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

          <div className="space-y-6">
            <div className="bg-[#161B22] p-6 rounded-xl border border-[#30363D] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-white">Performance Metrics</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-[#30363D]">
                  <span className="text-sm text-gray-400">Win Rate</span>
                  <span className="font-mono font-bold text-[#39D353]">{portfolio.metrics.winRate}%</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[#30363D]">
                  <span className="text-sm text-gray-400">Total Trades</span>
                  <span className="font-mono font-bold text-white">{portfolio.metrics.totalTrades}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[#30363D]">
                  <span className="text-sm text-gray-400">Profit Factor</span>
                  <span className="font-mono font-bold text-white">{portfolio.metrics.profitFactor}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[#30363D]">
                  <span className="text-sm text-gray-400">Max Drawdown</span>
                  <span className="font-mono font-bold text-[#F85149]">{portfolio.metrics.maxDrawdown}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Sharpe Ratio</span>
                  <span className="font-mono font-bold text-white">{portfolio.metrics.sharpeRatio}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

