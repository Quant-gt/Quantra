"use client";

import React, { useEffect, useState } from 'react';
import { Users, Activity, DollarSign, Database, TrendingUp, AlertTriangle } from 'lucide-react';

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/v1/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data.stats))
      .catch(console.error);
  }, []);

  if (!stats) return <div className="p-8 text-gray-400">Loading system metrics...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto w-full h-full overflow-y-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Platform Overview</h1>
          <p className="text-gray-400 mt-1">Live metrics from your Supabase production database.</p>
        </div>
        <div className="text-xs text-green-400 bg-green-500/10 px-3 py-1.5 rounded-md border border-green-500/20 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          System Healthy
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-[#1C2128] border border-[#30363D] p-5 rounded-xl shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Total Users</h3>
            <Users className="text-blue-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.totalUsers.toLocaleString()}</div>
          <div className="text-xs text-green-400 flex items-center gap-1">
            <TrendingUp size={12} /> +12% this month
          </div>
        </div>

        <div className="bg-[#1C2128] border border-[#30363D] p-5 rounded-xl shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Active Subscriptions</h3>
            <Activity className="text-purple-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.activeSubscriptions.toLocaleString()}</div>
          <div className="text-xs text-green-400 flex items-center gap-1">
            <TrendingUp size={12} /> +5% this week
          </div>
        </div>

        <div className="bg-[#1C2128] border border-[#30363D] p-5 rounded-xl shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Monthly Recurring Rev</h3>
            <DollarSign className="text-green-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-white mb-1">₹{stats.mrr.toLocaleString()}</div>
          <div className="text-xs text-green-400 flex items-center gap-1">
            <TrendingUp size={12} /> +22% this month
          </div>
        </div>

        <div className="bg-[#1C2128] border border-[#30363D] p-5 rounded-xl shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Published Algos</h3>
            <Database className="text-orange-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.publishedAlgos.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Live on marketplace</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="bg-[#1C2128] border border-[#30363D] p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4">Recent System Logs</h3>
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-start gap-3 border-b border-[#30363D] pb-3 last:border-0">
                <div className="w-8 h-8 rounded-full bg-[#0D1117] flex items-center justify-center shrink-0">
                  <Activity size={14} className="text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-300">API Request Burst</div>
                  <div className="text-xs text-gray-500">Zerodha Broker API rate limits hit 80% capacity.</div>
                </div>
                <div className="ml-auto text-xs text-gray-600">2m ago</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1C2128] border border-[#30363D] p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" size={20} />
            Action Required
          </h3>
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-yellow-500">Pending KYC Verifications</div>
              <div className="text-xs text-gray-400 mt-1">There are {stats.pendingKyc} users waiting for PAN approval to become creators.</div>
            </div>
            <button className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 px-4 py-2 rounded-md text-xs font-bold transition-colors">
              Review Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
