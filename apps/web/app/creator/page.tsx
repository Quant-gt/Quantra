"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, Users, Star, Shield, ArrowUpRight } from "lucide-react";

const earningsData = [
  { name: 'Nifty Scalper', earnings: 45000 },
  { name: 'BNF Trend', earnings: 15000 },
  { name: 'Crude Breakout', earnings: 28000 },
];

export default function CreatorDashboard() {
  const [strategies] = useState([
    { id: '1', name: 'Nifty Options Scalper', subscribers: 120, rating: 4.8, status: 'active', version: '1.4' },
    { id: '2', name: 'BankNifty Trend Follower', subscribers: 45, rating: 4.2, status: 'active', version: '1.0' },
    { id: '3', name: 'Crude Oil Breakout', subscribers: 85, rating: 4.5, status: 'pending_update', version: '2.1' }
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Creator Dashboard</h1>
          <p className="text-white/60">
            Manage your strategies, subscribers, and earnings.
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-white/50 mb-1">MTD Earnings</p>
                <p className="text-2xl font-bold text-white">₹88,000</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <p className="text-xs text-green-400 mt-2 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +12% from last month
            </p>
          </div>
          
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-white/50 mb-1">Total Subscribers</p>
                <p className="text-2xl font-bold text-white">250</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-xs text-white/40 mt-2">+15 new this week</p>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-white/50 mb-1">Avg Rating</p>
                <p className="text-2xl font-bold text-white">4.6</p>
              </div>
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
            <p className="text-xs text-white/40 mt-2">Based on 45 reviews</p>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-white/50 mb-1">Compliance Status</p>
                <p className="text-2xl font-bold text-green-400">Perfect</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Shield className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <p className="text-xs text-white/40 mt-2">RA License Valid</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Earnings Chart */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6">Earnings by Strategy</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
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
                  <p className="text-xs text-white/50">June 05, 2026</p>
                </div>
                <p className="text-lg font-bold text-white">₹88,000</p>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <div>
                  <p className="text-sm font-semibold text-white/70">Previous Payout</p>
                  <p className="text-xs text-white/30">May 05, 2026</p>
                </div>
                <p className="text-lg font-bold text-white/70">₹72,500</p>
              </div>
            </div>
            
            <button className="w-full mt-6 bg-white/5 hover:bg-white/10 text-white font-semibold py-2.5 rounded-lg transition-colors border border-white/10 text-sm">
              View Payout History
            </button>
          </div>
        </div>

        {/* Strategy Performance Table */}
        <div className="glass-panel rounded-xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-lg font-bold text-white">My Strategies</h3>
          </div>
          
          <table className="w-full text-left text-white">
            <thead className="text-xs text-white/50 uppercase bg-white/5">
              <tr>
                <th scope="col" className="px-6 py-4">Strategy</th>
                <th scope="col" className="px-6 py-4">Subscribers</th>
                <th scope="col" className="px-6 py-4">Rating</th>
                <th scope="col" className="px-6 py-4">Version</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {strategies.map((strat) => (
                <tr key={strat.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm">
                  <td className="px-6 py-4 font-bold text-white">{strat.name}</td>
                  <td className="px-6 py-4">{strat.subscribers}</td>
                  <td className="px-6 py-4 flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" /> {strat.rating}
                  </td>
                  <td className="px-6 py-4 text-white/50">v{strat.version}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      strat.status === 'active' ? 'border-green-500/30 bg-green-500/10 text-green-400' : 
                      'border-amber-500/30 bg-amber-500/10 text-amber-400'
                    }`}>
                      {strat.status === 'active' ? 'Active' : 'Pending Update'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-primary hover:underline font-medium text-sm">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
