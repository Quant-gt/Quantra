import React from 'react';
import { PowerOff, AlertOctagon } from 'lucide-react';

interface KillSwitchCardProps {
  killSwitchEngaged: boolean;
  onToggle: () => void;
}

export function KillSwitchCard({ killSwitchEngaged, onToggle }: KillSwitchCardProps) {
  return (
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
          onClick={onToggle}
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
  );
}
