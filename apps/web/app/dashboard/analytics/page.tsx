"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { PieChart as PieChartIcon, Activity } from "lucide-react";
import { toast } from "sonner";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/analytics')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        toast.error("Failed to fetch analytics data");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-white/50 animate-pulse">Loading analytics...</div>;

  const hasData = data?.hasData;

  if (!hasData) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 border-b border-white/10 pb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Portfolio Analytics</h1>
            <p className="text-white/60">Aggregate performance across all deployed strategies.</p>
          </div>
          <div className="glass-panel border border-white/10 rounded-xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-16 h-16 bg-[#21262D] rounded-full flex items-center justify-center mb-4 border border-[#30363D]">
              <Activity size={28} className="text-[#388BFD]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No Analytics Available</h2>
            <p className="text-gray-400 max-w-md text-sm leading-relaxed mb-6">
              You haven't executed any trades yet. Once your algorithms place trades, you'll see detailed breakdowns of your P&L, broker exposure, and strategy performance here.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            <p className="text-2xl font-bold text-white">Calculated live...</p>
          </div>
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <p className="text-xs text-white/50 mb-1">Total Net P&L</p>
            <p className="text-2xl font-bold text-green-400">Calculated live...</p>
          </div>
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <p className="text-xs text-white/50 mb-1">Win Rate</p>
            <p className="text-2xl font-bold text-white">Calculated live...</p>
          </div>
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <p className="text-xs text-white/50 mb-1">Max Drawdown</p>
            <p className="text-2xl font-bold text-white">Calculated live...</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Equity Curve */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6">Combined Equity Curve</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.equityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
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
                    data={data.brokerExposure}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.brokerExposure.map((entry: any, index: number) => (
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
              {data.brokerExposure.map((entry: any, index: number) => (
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
                <BarChart data={data.strategyPnl} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                  <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                  <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" width={100} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <Bar dataKey="pnl" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}>
                    {data.strategyPnl.map((entry: any, index: number) => (
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
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-colors text-sm" onClick={() => toast.info("No data available to generate report")}>
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

