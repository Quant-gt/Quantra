"use client";

import React, { useEffect, useState } from 'react';
import { Search, Ban, Edit2, User, Star } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/admin/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) return <div className="p-8 text-gray-400">Loading users...</div>;

  return (
    <div className="flex flex-col h-full bg-[#0B0F19]">
      <div className="px-8 py-6 border-b border-[#30363D] bg-[#0D1117]">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <User className="text-green-500" />
          User Management
        </h2>
        <p className="text-sm text-gray-400 mt-1">View and manage all registered platform users.</p>
      </div>

      <div className="p-8 flex-1 overflow-y-auto">
        <div className="bg-[#1C2128] border border-[#30363D] rounded-xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-[#30363D] flex items-center gap-4 bg-[#0D1117]">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="w-full bg-[#161B22] border border-[#30363D] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#161B22] border-b border-[#30363D] text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Role</th>
                <th className="px-6 py-4 font-bold">Subscription</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[#30363D] hover:bg-[#161B22]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white">{user.full_name || 'Anonymous'}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    {user.is_creator ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded">
                        <Star size={12} /> Creator
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Standard User</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono uppercase bg-[#0D1117] border border-[#30363D] text-gray-300 px-2 py-1 rounded">
                      {user.subscription_tier}
                    </span>
                    <span className={`ml-2 text-xs ${user.subscription_status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                      {user.subscription_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-colors" title="Edit Subscription">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors ml-2" title="Ban User">
                      <Ban size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
