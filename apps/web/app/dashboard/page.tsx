"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, Zap, BarChart3, Clock, Power } from 'lucide-react';

export default function DashboardPage() {
  const [isKillSwitchActive, setIsKillSwitchActive] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleKillSwitch = async () => {
    setIsPending(true);
    // Simulate API call
    setTimeout(() => {
      setIsKillSwitchActive(!isKillSwitchActive);
      setIsPending(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
            QUANTRA
          </h1>
          <p className="text-gray-400 mt-1">Algo Trading Cockpit</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#1A2333] px-4 py-2 rounded-lg border border-gray-800">
            <Clock size={16} className="text-blue-400" />
            <span className="text-sm font-mono">Market: Open</span>
          </div>
          <div className="bg-[#1A2333] px-4 py-2 rounded-lg border border-gray-800">
            <span className="text-sm">Welcome, Admin</span>
          </div>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1 */}
          <div className="bg-[#151C2C] p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Live Strategies</span>
              <Zap size={20} className="text-emerald-500" />
            </div>
            <h3 className="text-3xl font-bold">4 <span className="text-sm text-gray-500">/ 5 active</span></h3>
            <div className="mt-4 text-sm text-emerald-500">↑ 12% from yesterday</div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#151C2C] p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Current OPS</span>
              <BarChart3 size={20} className="text-blue-500" />
            </div>
            <h3 className="text-3xl font-bold">3.2 <span className="text-sm text-gray-500">/ 10 max</span></h3>
            <div className="mt-4 text-sm text-blue-500">Within SEBI limits</div>
          </div>

          {/* Card 3 (Full width in this column) */}
          <div className="md:col-span-2 bg-[#151C2C] p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Daily Compliance Status</span>
              <Shield size={20} className="text-emerald-500" />
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex-1 bg-[#1A2333] p-4 rounded-lg text-center">
                <div className="text-xs text-gray-500 mb-1">Daily 2FA</div>
                <div className="text-emerald-500 font-medium">Verified</div>
              </div>
              <div className="flex-1 bg-[#1A2333] p-4 rounded-lg text-center">
                <div className="text-xs text-gray-500 mb-1">Static IP</div>
                <div className="text-emerald-500 font-medium">Verified</div>
              </div>
              <div className="flex-1 bg-[#1A2333] p-4 rounded-lg text-center">
                <div className="text-xs text-gray-500 mb-1">Algo ID</div>
                <div className="text-emerald-500 font-medium">Registered</div>
              </div>
            </div>
          </div>
        </div>

        {/* Kill Switch Section */}
        <div className="lg:col-span-1">
          <div className="bg-[#151C2C] p-8 rounded-2xl border border-gray-800 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <ShieldAlert size={28} className={isKillSwitchActive ? "text-red-500" : "text-yellow-500"} />
                <h2 className="text-xl font-bold">Emergency Kill Switch</h2>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Activating the kill switch will immediately cancel all pending orders and pause all live strategies across all linked brokers. This action is compliant with SEBI 2026 mandates.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              {/* Status Indicator */}
              <div className={`text-sm font-medium ${isKillSwitchActive ? "text-red-500" : "text-emerald-500"}`}>
                Status: {isKillSwitchActive ? "ACTIVATED" : "System Normal"}
              </div>

              {/* Big Glassmorphism Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleKillSwitch}
                disabled={isPending}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  isKillSwitchActive
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg shadow-emerald-900/50"
                    : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-900/50"
                } ${isPending ? "opacity-75 cursor-wait" : ""}`}
              >
                <Power size={20} />
                {isPending ? "Processing..." : isKillSwitchActive ? "Deactivate Kill Switch" : "ACTIVATE KILL SWITCH"}
              </motion.button>
              
              <span className="text-xs text-gray-600 text-center">
                Requires admin privileges. Action will be logged to compliance audit trail.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
