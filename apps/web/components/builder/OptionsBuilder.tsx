"use client";

import React, { useState } from 'react';
import { Layers, Plus, Trash2, Zap } from 'lucide-react';

type Instrument = 'EQUITY' | 'FUTURES' | 'OPTIONS';
type OptionType = 'CALL' | 'PUT';
type Action = 'BUY' | 'SELL';

interface Leg {
  id: string;
  action: Action;
  type: OptionType;
  strike: string;
  expiry: string;
  qty: number;
}

export default function OptionsBuilder({ actionType = 'BUY' }: { actionType?: 'BUY' | 'SELL' }) {
  const [instrument, setInstrument] = useState<Instrument>('EQUITY');
  const [legs, setLegs] = useState<Leg[]>([
    { id: '1', action: actionType, type: 'CALL', strike: 'ATM', expiry: 'Current Week', qty: 1 }
  ]);

  const addLeg = () => {
    setLegs([...legs, { 
      id: Math.random().toString(36).substr(2, 9), 
      action: actionType, 
      type: 'CALL', 
      strike: 'ATM', 
      expiry: 'Current Week', 
      qty: 1 
    }]);
  };

  const removeLeg = (id: string) => {
    if (legs.length > 1) {
      setLegs(legs.filter(l => l.id !== id));
    }
  };

  const updateLeg = (id: string, field: keyof Leg, value: any) => {
    setLegs(legs.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const applyTemplate = (template: 'STRADDLE' | 'STRANGLE' | 'IRON_CONDOR') => {
    setInstrument('OPTIONS');
    if (template === 'STRADDLE') {
      setLegs([
        { id: '1', action: 'BUY', type: 'CALL', strike: 'ATM', expiry: 'Current Week', qty: 1 },
        { id: '2', action: 'BUY', type: 'PUT', strike: 'ATM', expiry: 'Current Week', qty: 1 }
      ]);
    } else if (template === 'STRANGLE') {
      setLegs([
        { id: '1', action: 'BUY', type: 'CALL', strike: 'OTM1', expiry: 'Current Week', qty: 1 },
        { id: '2', action: 'BUY', type: 'PUT', strike: 'OTM1', expiry: 'Current Week', qty: 1 }
      ]);
    } else if (template === 'IRON_CONDOR') {
      setLegs([
        { id: '1', action: 'SELL', type: 'PUT', strike: 'OTM1', expiry: 'Current Week', qty: 1 },
        { id: '2', action: 'BUY', type: 'PUT', strike: 'OTM2', expiry: 'Current Week', qty: 1 },
        { id: '3', action: 'SELL', type: 'CALL', strike: 'OTM1', expiry: 'Current Week', qty: 1 },
        { id: '4', action: 'BUY', type: 'CALL', strike: 'OTM2', expiry: 'Current Week', qty: 1 }
      ]);
    }
  };

  return (
    <div className="bg-[#1C2128] border border-[#30363D] rounded-lg p-4 mt-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-white">
          <Zap size={16} className={actionType === 'BUY' ? 'text-green-400' : 'text-red-400'} />
          <span className="font-bold text-sm">Execution Target</span>
        </div>
        
        <div className="flex bg-[#0D1117] rounded-md p-1 border border-[#30363D]">
          {['EQUITY', 'FUTURES', 'OPTIONS'].map(inst => (
            <button
              key={inst}
              onClick={() => setInstrument(inst as Instrument)}
              className={`px-3 py-1 text-xs font-bold rounded ${
                instrument === inst ? 'bg-[#30363D] text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {inst}
            </button>
          ))}
        </div>
      </div>

      {instrument === 'OPTIONS' && (
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="text-xs text-gray-400 flex items-center mr-2">Templates:</span>
          <button onClick={() => applyTemplate('STRADDLE')} className="text-xs bg-[#0D1117] border border-[#30363D] hover:border-purple-500 text-purple-400 px-2 py-1 rounded transition-colors">Straddle</button>
          <button onClick={() => applyTemplate('STRANGLE')} className="text-xs bg-[#0D1117] border border-[#30363D] hover:border-purple-500 text-purple-400 px-2 py-1 rounded transition-colors">Strangle</button>
          <button onClick={() => applyTemplate('IRON_CONDOR')} className="text-xs bg-[#0D1117] border border-[#30363D] hover:border-purple-500 text-purple-400 px-2 py-1 rounded transition-colors">Iron Condor</button>
          <span className="text-xs text-green-500 ml-auto flex items-center gap-1"><Layers size={12}/> Basket Execution</span>
        </div>
      )}

      {instrument === 'EQUITY' && (
        <div className="bg-[#0D1117] border border-[#30363D] p-3 rounded-md flex items-center">
          <span className="text-sm font-bold text-white">Base Asset (Cash)</span>
          <span className="ml-auto text-xs text-gray-500">Executes at Market Price</span>
        </div>
      )}

      {instrument === 'FUTURES' && (
        <div className="bg-[#0D1117] border border-[#30363D] p-3 rounded-md flex items-center gap-4">
          <span className="text-sm font-bold text-white">Futures Contract</span>
          <select className="bg-[#1C2128] border border-[#30363D] text-white text-xs px-2 py-1 rounded outline-none ml-auto">
            <option>Current Month</option>
            <option>Next Month</option>
            <option>Far Month</option>
          </select>
        </div>
      )}

      {instrument === 'OPTIONS' && (
        <div className="space-y-2">
          {legs.map((leg, index) => (
            <div key={leg.id} className="flex items-center gap-2 bg-[#0D1117] border border-[#30363D] p-2 rounded-md">
              <span className="text-xs text-gray-500 font-mono w-4">{index + 1}</span>
              
              <select 
                value={leg.action}
                onChange={(e) => updateLeg(leg.id, 'action', e.target.value)}
                className={`bg-[#1C2128] border border-[#30363D] text-xs font-bold px-2 py-1.5 rounded outline-none w-20 ${leg.action === 'BUY' ? 'text-green-400' : 'text-red-400'}`}
              >
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
              </select>

              <select 
                value={leg.qty}
                onChange={(e) => updateLeg(leg.id, 'qty', parseInt(e.target.value))}
                className="bg-[#1C2128] border border-[#30363D] text-white text-xs px-2 py-1.5 rounded outline-none w-16"
              >
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={3}>3x</option>
                <option value={4}>4x</option>
              </select>

              <select 
                value={leg.expiry}
                onChange={(e) => updateLeg(leg.id, 'expiry', e.target.value)}
                className="bg-[#1C2128] border border-[#30363D] text-white text-xs px-2 py-1.5 rounded outline-none flex-1"
              >
                <option>Current Week</option>
                <option>Next Week</option>
                <option>Current Month</option>
              </select>

              <select 
                value={leg.strike}
                onChange={(e) => updateLeg(leg.id, 'strike', e.target.value)}
                className="bg-[#1C2128] border border-[#30363D] text-white text-xs px-2 py-1.5 rounded outline-none flex-1"
              >
                <option value="ITM3">ITM3</option>
                <option value="ITM2">ITM2</option>
                <option value="ITM1">ITM1</option>
                <option value="ATM">ATM (At the money)</option>
                <option value="OTM1">OTM1</option>
                <option value="OTM2">OTM2</option>
                <option value="OTM3">OTM3</option>
              </select>

              <select 
                value={leg.type}
                onChange={(e) => updateLeg(leg.id, 'type', e.target.value)}
                className="bg-[#1C2128] border border-[#30363D] text-white text-xs font-bold px-2 py-1.5 rounded outline-none w-20"
              >
                <option value="CALL">CALL</option>
                <option value="PUT">PUT</option>
              </select>

              <button 
                onClick={() => removeLeg(leg.id)}
                disabled={legs.length === 1}
                className="p-1.5 text-gray-500 hover:text-red-400 disabled:opacity-30 transition-colors ml-auto"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          <button 
            onClick={addLeg}
            className="w-full mt-2 py-2 border border-dashed border-[#30363D] hover:border-gray-500 text-gray-500 hover:text-gray-300 rounded-md text-xs font-bold flex items-center justify-center gap-1 transition-colors"
          >
            <Plus size={14} /> Add Leg
          </button>
        </div>
      )}
    </div>
  );
}
