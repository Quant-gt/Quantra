"use client";

import React, { useState } from 'react';
import { AlertOctagon, TrendingDown, ShieldAlert, PowerOff, Save, Check } from 'lucide-react';

export default function RiskManagement() {
  const [killSwitchEngaged, setKillSwitchEngaged] = useState(false);
  const [maxDrawdown, setMaxDrawdown] = useState(5.0);
  const [maxPositions, setMaxPositions] = useState(10);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleKillSwitch = () => {
    if (!killSwitchEngaged) {
      const confirm = window.confirm(
        "WARNING: Engaging the Global Kill Switch will immediately MARKET SELL all open positions to flatten your portfolio and pause all active algorithmic deployments. Proceed?"
      );
      if (confirm) setKillSwitchEngaged(true);
    } else {
      setKillSwitchEngaged(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldAlert className="text-red-500" />
          Global Risk Management
        </h2>
        <p className="text-sm text-gray-400 mt-1">Configure account-level safety parameters to protect your capital from algorithmic anomalies.</p>
      </div>

      <div className="space-y-8 max-w-3xl flex-1">
        
        {/* Kill Switch Card */}
        <div className={`border rounded-xl p-6 relative overflow-hidden transition-colors duration-500 ${killSwitchEngaged ? 'bg-red-500/10 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'bg-[#1C2128] border-[#30363D]'}`}>
          {killSwitchEngaged && (
            <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />
          )}
          
          <div className="flex justify-between items-start relative z-10">
            <div className="max-w-xl">
              <h3 className={`text-lg font-bold flex items-center gap-2 ${killSwitchEngaged ? 'text-red-500' : 'text-white'}`}>
                <PowerOff size={20} />
                Global Kill Switch
              </h3>
              <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                If algorithms behave erratically or extreme market volatility occurs, activating this will <strong>IMMEDIATELY flatten your portfolio</strong> (Market Sell all open positions) and pause all active strategy deployments.
              </p>
            </div>
            <button 
              onClick={handleKillSwitch}
              className={`w-20 h-10 rounded-full p-1 transition-all duration-300 relative flex items-center ${killSwitchEngaged ? 'bg-red-500' : 'bg-gray-700'}`}
            >
              <div className={`w-8 h-8 bg-white rounded-full shadow-md transform transition-transform duration-300 ${killSwitchEngaged ? 'translate-x-10' : 'translate-x-0'}`} />
            </button>
          </div>
          
          {killSwitchEngaged && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm font-bold flex items-center gap-2">
              <AlertOctagon size={16} /> SYSTEM HALTED. ALL POSITIONS LIQUIDATED.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Max Drawdown */}
          <div className="bg-[#1C2128] border border-[#30363D] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="text-yellow-500" size={20} />
              <h3 className="text-md font-bold text-white">Max Daily Drawdown</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4">If your total portfolio drops by this percentage in a single day, all positions will be flattened.</p>
            
            <div className="flex items-center gap-3">
              <input 
                type="range" 
                min="0.5" 
                max="20" 
                step="0.5" 
                value={maxDrawdown} 
                onChange={(e) => setMaxDrawdown(parseFloat(e.target.value))}
                className="flex-1 accent-yellow-500"
              />
              <div className="bg-[#0D1117] border border-[#30363D] px-3 py-1.5 rounded-lg text-white font-bold min-w-[70px] text-center">
                {maxDrawdown}%
              </div>
            </div>
          </div>

          {/* Max Open Positions */}
          <div className="bg-[#1C2128] border border-[#30363D] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertOctagon className="text-blue-500" size={20} />
              <h3 className="text-md font-bold text-white">Max Open Positions</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4">The maximum number of simultaneous trades the engine is allowed to hold across all algorithms.</p>
            
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                min="1" 
                max="100" 
                value={maxPositions} 
                onChange={(e) => setMaxPositions(parseInt(e.target.value))}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-2 text-white focus:border-[#58A6FF] outline-none transition-colors"
              />
            </div>
          </div>
        </div>

      </div>

      <div className="pt-6 border-t border-[#30363D] flex justify-end mt-8">
        <button 
          onClick={handleSave}
          className={`px-6 py-2 rounded-md text-sm font-bold transition-all shadow-lg flex items-center gap-2 ${saved ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-[#238636] hover:bg-[#2ea043] text-white'}`}
        >
          {saved ? <Check size={16} /> : <Save size={16} />} 
          {saved ? 'Parameters Saved' : 'Save Parameters'}
        </button>
      </div>
    </div>
  );
}
