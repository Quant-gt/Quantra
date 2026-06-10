"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Star, Shield, ArrowUpRight, Activity } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CreatorDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/creator/earnings')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        toast.error("Failed to fetch creator earnings");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-white/50 animate-pulse">Loading creator data...</div>;

  const hasData = data?.hasData;

  if (!hasData) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 border-b border-white/10 pb-6 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Creator Dashboard</h1>
              <p className="text-white/60">Manage your strategies, subscribers, and earnings.</p>
            </div>
            <Link href="/creator/publish" className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold transition-colors flex items-center gap-2">
              Publish New Strategy
            </Link>
          </div>
          <div className="glass-panel border border-white/10 rounded-xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-16 h-16 bg-[#21262D] rounded-full flex items-center justify-center mb-4 border border-[#30363D]">
              <Star size={28} className="text-[#388BFD]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Become a Strategy Creator</h2>
            <p className="text-gray-400 max-w-md text-sm leading-relaxed mb-6">
              Publish your first algorithmic strategy to the Quantra Marketplace. Start earning monthly recurring revenue (MRR) from subscribers worldwide.
            </p>
            <Link href="/creator/publish" className="px-6 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg text-sm font-bold transition-all shadow-lg flex items-center gap-2">
              <Activity size={16} /> Publish Your First Algorithm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 border-b border-white/10 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Creator Dashboard</h1>
            <p className="text-white/60">
              Manage your strategies, subscribers, and earnings.
            </p>
          </div>
          <Link 
            href="/creator/publish" 
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold transition-colors flex items-center gap-2"
          >
            Publish New Strategy
          </Link>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-white/50 mb-1">Monthly Recurring Revenue</p>
                <p className="text-2xl font-bold text-white">₹{data.mrr.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-white/50 mb-1">Active Subscribers</p>
                <p className="text-2xl font-bold text-white">{data.activeSubscribers}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-white/50 mb-1">Avg Rating</p>
                <p className="text-2xl font-bold text-white">4.8</p>
              </div>
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-white/50 mb-1">Compliance Status</p>
                <p className="text-2xl font-bold text-green-400">Verified</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Shield className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Earnings Chart */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6">Cumulative Earnings (YTD)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.earningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payout Timeline */}
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6">Payout Timeline</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <div>
                  <p className="text-sm font-semibold text-white">Next Payout</p>
                  <p className="text-xs text-white/50">1st of Next Month</p>
                </div>
                <p className="text-lg font-bold text-white">₹{data.mrr.toLocaleString()}</p>
              </div>
            </div>
            
            <button className="w-full mt-6 bg-white/5 hover:bg-white/10 text-white font-semibold py-2.5 rounded-lg transition-colors border border-white/10 text-sm">
              View Payout History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

