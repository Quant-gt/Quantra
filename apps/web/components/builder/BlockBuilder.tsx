"use client";

import { CheckSquare, Square, X, Plus, Zap, Activity } from 'lucide-react';
import { useState } from 'react';
import BacktestModal from './BacktestModal';
import OptionsBuilder from './OptionsBuilder';
import { createClient } from '@/lib/supabase/client';

export default function BlockBuilder() {
  const [buyEnabled, setBuyEnabled] = useState(true);
  const [sellEnabled, setSellEnabled] = useState(true);
  const [isBacktestModalOpen, setIsBacktestModalOpen] = useState(false);

  return (
    <div className="p-8 max-w-5xl mx-auto flex flex-col h-full w-full">
      <div className="bg-[#1C2128] rounded-xl border border-[#30363D] overflow-hidden shadow-2xl flex flex-col">
        {/* Title */}
        <div className="px-6 py-5 border-b border-[#30363D]">
          <h2 className="text-lg font-bold text-white">Dual Strategy Automation Builder</h2>
        </div>

        <div className="p-6 flex flex-col gap-6">
          
          {/* BUY PIPELINE */}
          <div className={`rounded-xl border ${buyEnabled ? 'border-[#238636]/50 bg-[#238636]/5' : 'border-[#30363D] bg-[#0D1117]'} p-5 transition-colors`}>
            <div className="flex items-center justify-between mb-4">
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setBuyEnabled(!buyEnabled)}
              >
                {buyEnabled ? (
                  <CheckSquare className="text-[#39D353]" size={20} />
                ) : (
                  <Square className="text-gray-500" size={20} />
                )}
                <h3 className={`font-bold ${buyEnabled ? 'text-[#39D353]' : 'text-gray-500'}`}>▼ WHEN (Buy Pipeline)</h3>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-300">Allocation per trade: ₹</span>
                  <input 
                    type="text" 
                    defaultValue="10000"
                    disabled={!buyEnabled}
                    className="bg-[#0D1117] border border-[#30363D] text-white text-sm rounded-md px-3 py-1 w-24 outline-none focus:border-[#58A6FF] disabled:opacity-50"
                  />
                </div>
                <button 
                  disabled={!buyEnabled}
                  className="bg-[#21262D] hover:bg-[#30363D] text-gray-300 text-xs font-bold py-1.5 px-3 rounded-md border border-[#30363D] flex items-center gap-1 disabled:opacity-50"
                >
                  <Plus size={14} /> Block
                </button>
              </div>
            </div>

            {/* Condition Block */}
            <div className={`flex items-center gap-3 mb-4 ${!buyEnabled && 'opacity-50 pointer-events-none'}`}>
              <div className="flex-1 bg-[#0D1117] border border-[#30363D] rounded-lg p-1 flex">
                <select className="bg-transparent text-white text-sm w-full px-3 py-2 outline-none appearance-none cursor-pointer">
                  <option className="bg-[#1C2128] text-white">Close Price</option>
                  <option className="bg-[#1C2128] text-white">Volume</option>
                  <option className="bg-[#1C2128] text-white">RSI (14)</option>
                  <option className="bg-[#1C2128] text-white">MACD (12, 26, 9)</option>
                  <option className="bg-[#1C2128] text-white">SMA (50)</option>
                  <option className="bg-[#1C2128] text-white">EMA (20)</option>
                  <option className="bg-[#1C2128] text-white">Bollinger Bands</option>
                  <option className="bg-[#1C2128] text-white">VWAP</option>
                  <option className="bg-[#1C2128] text-white">Stochastic</option>
                </select>
              </div>
              
              <div className="bg-[#1F2937] border border-blue-900/30 rounded-lg p-1">
                <select className="bg-transparent text-[#8B5CF6] text-sm font-bold px-3 py-2 outline-none appearance-none cursor-pointer">
                  <option className="bg-[#1C2128] text-white">Greater Than</option>
                  <option className="bg-[#1C2128] text-white">Less Than</option>
                  <option className="bg-[#1C2128] text-white">Crosses Above</option>
                </select>
              </div>

              <div className="flex-[2] bg-[#0D1117] border border-[#30363D] rounded-lg p-1 flex items-center">
                <select className="bg-transparent text-white text-sm px-3 py-2 outline-none border-r border-[#30363D] appearance-none cursor-pointer">
                  <option className="bg-[#1C2128] text-white">Number</option>
                  <option className="bg-[#1C2128] text-white">Indicator</option>
                </select>
                <input 
                  type="text" 
                  defaultValue="100"
                  className="bg-transparent text-white text-sm w-full px-3 py-2 outline-none"
                />
              </div>

              <button className="bg-[#21262D] hover:bg-red-500/20 text-red-400 p-2 rounded-lg border border-[#30363D] transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Action Block - Advanced Derivatives Configurator */}
            <div className={`mt-4 ${!buyEnabled && 'opacity-50 pointer-events-none'}`}>
              <OptionsBuilder actionType="BUY" />
            </div>
          </div>

          {/* SELL PIPELINE */}
          <div className={`rounded-xl border ${sellEnabled ? 'border-red-500/50 bg-red-500/5' : 'border-[#30363D] bg-[#0D1117]'} p-5 transition-colors`}>
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setSellEnabled(!sellEnabled)}
            >
              {sellEnabled ? (
                <CheckSquare className="text-red-400" size={20} />
              ) : (
                <Square className="text-gray-500" size={20} />
              )}
              <h3 className={`font-bold ${sellEnabled ? 'text-red-400' : 'text-gray-500'}`}>▼ WHEN (Sell Pipeline)</h3>
            </div>
            
            {sellEnabled && (
              <>
                {/* Condition Block */}
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex-1 bg-[#0D1117] border border-[#30363D] rounded-lg p-1 flex">
                    <select className="bg-transparent text-white text-sm w-full px-3 py-2 outline-none appearance-none cursor-pointer" defaultValue="RSI (14)">
                      <option className="bg-[#1C2128] text-white">Close Price</option>
                      <option className="bg-[#1C2128] text-white">Volume</option>
                      <option className="bg-[#1C2128] text-white">RSI (14)</option>
                      <option className="bg-[#1C2128] text-white">MACD (12, 26, 9)</option>
                      <option className="bg-[#1C2128] text-white">SMA (50)</option>
                      <option className="bg-[#1C2128] text-white">EMA (20)</option>
                      <option className="bg-[#1C2128] text-white">Bollinger Bands</option>
                      <option className="bg-[#1C2128] text-white">VWAP</option>
                      <option className="bg-[#1C2128] text-white">Stochastic</option>
                    </select>
                  </div>
                  
                  <div className="bg-[#1F2937] border border-blue-900/30 rounded-lg p-1">
                    <select className="bg-transparent text-[#8B5CF6] text-sm font-bold px-3 py-2 outline-none appearance-none cursor-pointer" defaultValue="Less Than">
                      <option className="bg-[#1C2128] text-white">Greater Than</option>
                      <option className="bg-[#1C2128] text-white">Less Than</option>
                      <option className="bg-[#1C2128] text-white">Crosses Below</option>
                    </select>
                  </div>

                  <div className="flex-[2] bg-[#0D1117] border border-[#30363D] rounded-lg p-1 flex items-center">
                    <select className="bg-transparent text-white text-sm px-3 py-2 outline-none border-r border-[#30363D] appearance-none cursor-pointer">
                      <option className="bg-[#1C2128] text-white">Number</option>
                      <option className="bg-[#1C2128] text-white">Indicator</option>
                    </select>
                    <input 
                      type="text" 
                      defaultValue="30"
                      className="bg-transparent text-white text-sm w-full px-3 py-2 outline-none"
                    />
                  </div>

                  <button className="bg-[#21262D] hover:bg-red-500/20 text-red-400 p-2 rounded-lg border border-[#30363D] transition-colors">
                    <X size={16} />
                  </button>
                </div>

                {/* Action Block - Advanced Derivatives Configurator */}
                <div className="mt-4">
                  <OptionsBuilder actionType="SELL" />
                </div>
              </>
            )}
          </div>

          {/* Broker Auth Box */}
          <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-5 mt-2">
            <h4 className="text-sm font-bold text-gray-300 mb-4">Broker Interface Authentication (Kite / Breeze)</h4>
            
            <div className="flex gap-6 mb-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-[#58A6FF] mb-2">API Key</label>
                <input 
                  type="password" 
                  defaultValue="****************"
                  className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-4 py-2 text-white outline-none focus:border-[#58A6FF]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-[#58A6FF] mb-2">API Secret</label>
                <input 
                  type="password" 
                  defaultValue="********************************"
                  className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-4 py-2 text-white outline-none focus:border-[#58A6FF]"
                />
              </div>
            </div>
            
            <p className="text-xs text-gray-500">
              Your keys are stored securely offline in 'algo_api_key' cache. The automated strategy will use them to place live trades on signals.
            </p>
          </div>

        </div>

        <div className="px-6 py-5 border-t border-[#30363D] bg-[#0B0F19] flex justify-end gap-4">
          <button 
            onClick={() => setIsBacktestModalOpen(true)}
            className="bg-transparent border border-[#6366F1] hover:bg-[#6366F1]/10 text-[#6366F1] px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
          >
            <Activity size={16} /> Run Backtest
          </button>
          
          <button 
            onClick={async () => {
              try {
                const supabase = createClient();
                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token;
                const userId = session?.user?.id || 'ef748ee3-b611-45da-8ca5-968bc9f3337d';

                const res = await fetch('http://localhost:3002/execute/fanout', {
                  method: 'POST',
                  headers: { 
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                  },
                  body: JSON.stringify({
                    creator_id: userId,
                    strategy_id: '82d2d8a6-706c-479d-836a-a83388902a31',
                    symbol: 'RELIANCE',
                    action: 'BUY',
                    base_qty: 100
                  })
                });
                const data = await res.json();
                alert(`🚀 Fan-Out Execution: ${data.message} (${data.executions} broker accounts fired)`);
              } catch (e) {
                alert('Backend execution engine is not running or failed.');
              }
            }}
            className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-90 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg flex items-center gap-2"
          >
            <Zap size={16} className="fill-current" /> Launch Automated Trading
          </button>
        </div>
      </div>
      <BacktestModal 
        isOpen={isBacktestModalOpen} 
        onClose={() => setIsBacktestModalOpen(false)} 
        strategyId="82d2d8a6-706c-479d-836a-a83388902a31" 
      />
    </div>
  );
}
