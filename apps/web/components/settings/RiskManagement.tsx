"use client";

import React, { useState } from 'react';
import { ShieldAlert, Save, Check } from 'lucide-react';
import { KillSwitchCard } from './KillSwitchCard';
import { RiskInputs } from './RiskInputs';

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
        <KillSwitchCard killSwitchEngaged={killSwitchEngaged} onToggle={handleKillSwitch} />
        <RiskInputs 
          maxDrawdown={maxDrawdown} 
          setMaxDrawdown={setMaxDrawdown} 
          maxPositions={maxPositions} 
          setMaxPositions={setMaxPositions} 
        />
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
