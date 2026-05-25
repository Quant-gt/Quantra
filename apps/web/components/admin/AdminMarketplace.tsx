"use client";

import React, { useEffect, useState } from 'react';
import { Search, Database, EyeOff, CheckCircle } from 'lucide-react';

export default function AdminMarketplace() {
  const [strategies, setStrategies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/admin/strategies')
      .then(res => res.json())
      .then(data => {
        setStrategies(data.strategies || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) return <div className="p-8 text-gray-400">Loading algorithms...</div>;

  return (
    <div className="flex flex-col h-full bg-[#0B0F19]">
      <div className="px-8 py-6 border-b border-[#30363D] bg-[#0D1117]">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Database className="text-purple-500" />
          Marketplace Algorithms
        </h2>
        <p className="text-sm text-gray-400 mt-1">Review and manage strategies published to the public marketplace.</p>
      </div>

      <div className="p-8 flex-1 overflow-y-auto">
        <div className="bg-[#1C2128] border border-[#30363D] rounded-xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-[#30363D] flex items-center gap-4 bg-[#0D1117]">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Search strategies or creators..." 
                className="w-full bg-[#161B22] border border-[#30363D] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#161B22] border-b border-[#30363D] text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 font-bold">Strategy Info</th>
                <th className="px-6 py-4 font-bold">Creator</th>
                <th className="px-6 py-4 font-bold">Performance & Subs</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {strategies.map((strategy) => (
                <tr key={strategy.id} className="border-b border-[#30363D] hover:bg-[#161B22]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white">{strategy.name}</div>
                    <div className="text-xs mt-1">
                      <span className={`inline-flex items-center gap-1 font-bold ${strategy.status === 'published' ? 'text-green-400' : 'text-gray-500'}`}>
                        {strategy.status === 'published' && <CheckCircle size={12} />}
                        {strategy.status.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300 font-medium">{strategy.creator_name}</div>
                    <div className="text-xs text-gray-500">{strategy.creator_email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white font-bold">₹{strategy.monthly_fee}/mo</div>
                    <div className="text-xs text-purple-400">{strategy.subscriber_count} Active Subscribers</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors" title="Suspend Strategy">
                      <EyeOff size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {strategies.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No strategies found in the database.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
