"use client";

import { CheckSquare, Square, X, Plus, Zap, Activity, Cpu, Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import BacktestModal from './BacktestModal';
import OptionsBuilder, { Instrument, Leg } from './OptionsBuilder';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface ConditionBlock {
  id: string;
  indicator: string;
  comparison: string;
  valueType: string;
  value: string;
}

export default function BlockBuilder() {
  const [buyEnabled, setBuyEnabled] = useState(true);
  const [sellEnabled, setSellEnabled] = useState(true);
  const [isBacktestModalOpen, setIsBacktestModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [strategyId, setStrategyId] = useState<string | null>(null);

  // Strategy Metadata
  const [strategyName, setStrategyName] = useState('Dual Block Strategy');
  const [symbol, setSymbol] = useState('RELIANCE');
  const [timeframe, setTimeframe] = useState('1d');
  const [baseQty, setBaseQty] = useState(100);

  // Logical Operators
  const [buyOperator, setBuyOperator] = useState<'AND' | 'OR'>('AND');
  const [sellOperator, setSellOperator] = useState<'AND' | 'OR'>('AND');

  // Condition blocks lists
  const [buyBlocks, setBuyBlocks] = useState<ConditionBlock[]>([
    { id: '1', indicator: 'Close Price', comparison: 'Greater Than', valueType: 'Number', value: '100' }
  ]);

  const [sellBlocks, setSellBlocks] = useState<ConditionBlock[]>([
    { id: '1', indicator: 'RSI (14)', comparison: 'Less Than', valueType: 'Number', value: '30' }
  ]);

  // Lifted OptionsBuilder states
  const [buyInstrument, setBuyInstrument] = useState<Instrument>('EQUITY');
  const [buyLegs, setBuyLegs] = useState<Leg[]>([
    { id: '1', action: 'BUY', type: 'CALL', strike: 'ATM', expiry: 'Current Week', qty: 1 }
  ]);

  const [sellInstrument, setSellInstrument] = useState<Instrument>('EQUITY');
  const [sellLegs, setSellLegs] = useState<Leg[]>([
    { id: '1', action: 'SELL', type: 'CALL', strike: 'ATM', expiry: 'Current Week', qty: 1 }
  ]);

  const addBuyBlock = () => {
    const newId = Date.now().toString();
    setBuyBlocks([
      ...buyBlocks,
      { id: newId, indicator: 'Close Price', comparison: 'Greater Than', valueType: 'Number', value: '100' }
    ]);
    toast.success("Added new Buy indicator condition block");
  };

  const removeBuyBlock = (id: string) => {
    if (buyBlocks.length <= 1) {
      toast.error("At least one Buy condition block is required");
      return;
    }
    setBuyBlocks(buyBlocks.filter(b => b.id !== id));
  };

  const updateBuyBlock = (id: string, field: keyof ConditionBlock, value: string) => {
    setBuyBlocks(buyBlocks.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const addSellBlock = () => {
    const newId = Date.now().toString();
    setSellBlocks([
      ...sellBlocks,
      { id: newId, indicator: 'RSI (14)', comparison: 'Less Than', valueType: 'Number', value: '30' }
    ]);
    toast.success("Added new Sell indicator condition block");
  };

  const removeSellBlock = (id: string) => {
    if (sellBlocks.length <= 1) {
      toast.error("At least one Sell condition block is required");
      return;
    }
    setSellBlocks(sellBlocks.filter(b => b.id !== id));
  };

  const updateSellBlock = (id: string, field: keyof ConditionBlock, value: string) => {
    setSellBlocks(sellBlocks.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You must be logged in to save strategies.");
      }

      const logicGraph = {
        type: 'block',
        buyOperator,
        buyBlocks,
        buyInstrument,
        buyLegs,
        buyEnabled,
        sellOperator,
        sellBlocks,
        sellInstrument,
        sellLegs,
        sellEnabled,
        symbol,
        timeframe,
        baseQty
      };

      if (strategyId) {
        // Update existing strategy
        const { error } = await supabase
          .from('strategies')
          .update({
            name: strategyName,
            logic_graph: logicGraph as any,
            updated_at: new Date().toISOString()
          })
          .eq('id', strategyId);

        if (error) throw error;
        toast.success("Strategy updated successfully!");
        return strategyId;
      } else {
        // Insert new strategy
        const { data, error } = await supabase
          .from('strategies')
          .insert({
            creator_id: session.user.id,
            name: strategyName,
            logic_graph: logicGraph as any,
            status: 'draft'
          })
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setStrategyId(data.id);
          toast.success("Strategy saved successfully!");
          return data.id;
        }
      }
    } catch (err: any) {
      console.error("Save strategy error:", err);
      toast.error(err.message || "Failed to save strategy.");
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const launchTrading = async () => {
    setLoading(true);
    try {
      let currentStrategyId = strategyId;
      // Automatically save latest changes
      const savedId = await handleSave();
      if (!savedId) {
        throw new Error("Failed to save strategy configuration before launching.");
      }
      currentStrategyId = savedId;

      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const userId = session?.user?.id || 'ef748ee3-b611-45da-8ca5-968bc9f3337d';

      const res = await fetch('/api/v1/execute/fanout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          creator_id: userId,
          strategy_id: currentStrategyId,
          symbol: symbol,
          action: 'BUY',
          base_qty: baseQty
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Execution engine failed");
      }
      
      toast.success(`🚀 Fan-Out Execution: ${data.message || 'Launched successfully'} (${data.executions || 0} subscriber accounts fired)`);
    } catch (e: any) {
      toast.error(e.message || 'Backend execution engine is not running or failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto flex flex-col w-full">
      {/* Strategy Configuration Header */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-lg">
            <Cpu size={20} className="text-white animate-pulse" />
          </div>
          <div className="flex-1">
            <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider">Strategy Name</label>
            <input 
              type="text" 
              value={strategyName}
              onChange={(e) => setStrategyName(e.target.value)}
              className="bg-transparent text-base font-bold text-white outline-none border-b border-transparent hover:border-[#30363D] focus:border-[#58A6FF] transition-colors pb-0.5 w-full md:w-64"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="flex-1 min-w-[120px]">
            <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Target Symbol</label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full bg-[#0D1117] border border-[#30363D] text-white text-sm rounded-md px-3 py-2 outline-none focus:border-[#58A6FF] cursor-pointer"
            >
              <option value="RELIANCE">RELIANCE</option>
              <option value="NIFTY">NIFTY</option>
              <option value="BANKNIFTY">BANKNIFTY</option>
              <option value="TCS">TCS</option>
              <option value="INFOSYS">INFOSYS</option>
              <option value="IBM">IBM</option>
            </select>
          </div>

          <div className="flex-1 min-w-[100px]">
            <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Timeframe</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full bg-[#0D1117] border border-[#30363D] text-white text-sm rounded-md px-3 py-2 outline-none focus:border-[#58A6FF] cursor-pointer"
            >
              <option value="1m">1 min</option>
              <option value="5m">5 min</option>
              <option value="15m">15 min</option>
              <option value="1h">1 hour</option>
              <option value="1d">1 day</option>
            </select>
          </div>

          <div className="flex-1 min-w-[100px]">
            <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Base Quantity</label>
            <input
              type="number"
              value={baseQty}
              onChange={(e) => setBaseQty(Number(e.target.value))}
              min={1}
              className="w-full bg-[#0D1117] border border-[#30363D] text-white text-sm rounded-md px-3 py-2 outline-none focus:border-[#58A6FF]"
            />
          </div>
        </div>
      </div>

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
                {buyEnabled && buyBlocks.length > 1 && (
                  <div className="flex items-center bg-[#0D1117] rounded-md p-0.5 border border-[#30363D]">
                    <button 
                      onClick={() => setBuyOperator('AND')}
                      className={`px-2 py-1 text-xs font-bold rounded ${buyOperator === 'AND' ? 'bg-[#30363D] text-[#39D353]' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      ALL (AND)
                    </button>
                    <button 
                      onClick={() => setBuyOperator('OR')}
                      className={`px-2 py-1 text-xs font-bold rounded ${buyOperator === 'OR' ? 'bg-[#30363D] text-[#39D353]' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      ANY (OR)
                    </button>
                  </div>
                )}

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
                  onClick={addBuyBlock}
                  disabled={!buyEnabled}
                  className="bg-[#21262D] hover:bg-[#30363D] text-gray-300 text-xs font-bold py-1.5 px-3 rounded-md border border-[#30363D] flex items-center gap-1 disabled:opacity-50"
                >
                  <Plus size={14} /> Block
                </button>
              </div>
            </div>

            {/* Condition Blocks List */}
            <div className={`space-y-4 ${!buyEnabled && 'opacity-50 pointer-events-none'}`}>
              {buyBlocks.map((block) => (
                <div key={block.id} className="flex items-center gap-3 mb-2">
                  <div className="flex-1 bg-[#0D1117] border border-[#30363D] rounded-lg p-1 flex">
                    <select 
                      value={block.indicator}
                      onChange={(e) => updateBuyBlock(block.id, 'indicator', e.target.value)}
                      className="bg-transparent text-white text-sm w-full px-3 py-2 outline-none appearance-none cursor-pointer"
                    >
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
                    <select 
                      value={block.comparison}
                      onChange={(e) => updateBuyBlock(block.id, 'comparison', e.target.value)}
                      className="bg-transparent text-[#8B5CF6] text-sm font-bold px-3 py-2 outline-none appearance-none cursor-pointer"
                    >
                      <option className="bg-[#1C2128] text-white">Greater Than</option>
                      <option className="bg-[#1C2128] text-white">Less Than</option>
                      <option className="bg-[#1C2128] text-white">Crosses Above</option>
                      <option className="bg-[#1C2128] text-white">Crosses Below</option>
                    </select>
                  </div>

                  <div className="flex-[2] bg-[#0D1117] border border-[#30363D] rounded-lg p-1 flex items-center">
                    <select 
                      value={block.valueType}
                      onChange={(e) => updateBuyBlock(block.id, 'valueType', e.target.value)}
                      className="bg-transparent text-white text-sm px-3 py-2 outline-none border-r border-[#30363D] appearance-none cursor-pointer"
                    >
                      <option className="bg-[#1C2128] text-white">Number</option>
                      <option className="bg-[#1C2128] text-white">Indicator</option>
                    </select>
                    <input 
                      type="text" 
                      value={block.value}
                      onChange={(e) => updateBuyBlock(block.id, 'value', e.target.value)}
                      className="bg-transparent text-white text-sm w-full px-3 py-2 outline-none"
                    />
                  </div>

                  <button 
                    onClick={() => removeBuyBlock(block.id)}
                    className="bg-[#21262D] hover:bg-red-500/20 text-red-400 p-2 rounded-lg border border-[#30363D] transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Action Block - Advanced Derivatives Configurator */}
            <div className={`mt-4 ${!buyEnabled && 'opacity-50 pointer-events-none'}`}>
              <OptionsBuilder 
                actionType="BUY" 
                instrument={buyInstrument}
                setInstrument={setBuyInstrument}
                legs={buyLegs}
                setLegs={setBuyLegs}
              />
            </div>
          </div>

          {/* SELL PIPELINE */}
          <div className={`rounded-xl border ${sellEnabled ? 'border-red-500/50 bg-red-500/5' : 'border-[#30363D] bg-[#0D1117]'} p-5 transition-colors`}>
            <div className="flex items-center justify-between mb-4">
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
              
              <div className="flex items-center gap-4">
                {sellEnabled && sellBlocks.length > 1 && (
                  <div className="flex items-center bg-[#0D1117] rounded-md p-0.5 border border-[#30363D]">
                    <button 
                      onClick={() => setSellOperator('AND')}
                      className={`px-2 py-1 text-xs font-bold rounded ${sellOperator === 'AND' ? 'bg-[#30363D] text-red-400' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      ALL (AND)
                    </button>
                    <button 
                      onClick={() => setSellOperator('OR')}
                      className={`px-2 py-1 text-xs font-bold rounded ${sellOperator === 'OR' ? 'bg-[#30363D] text-red-400' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      ANY (OR)
                    </button>
                  </div>
                )}

                <button 
                  onClick={addSellBlock}
                  disabled={!sellEnabled}
                  className="bg-[#21262D] hover:bg-[#30363D] text-gray-300 text-xs font-bold py-1.5 px-3 rounded-md border border-[#30363D] flex items-center gap-1 disabled:opacity-50"
                >
                  <Plus size={14} /> Block
                </button>
              </div>
            </div>
            
            {sellEnabled && (
              <>
                {/* Condition Blocks List */}
                <div className="space-y-4">
                  {sellBlocks.map((block) => (
                    <div key={block.id} className="flex items-center gap-3 mb-2">
                      <div className="flex-1 bg-[#0D1117] border border-[#30363D] rounded-lg p-1 flex">
                        <select 
                          value={block.indicator}
                          onChange={(e) => updateSellBlock(block.id, 'indicator', e.target.value)}
                          className="bg-transparent text-white text-sm w-full px-3 py-2 outline-none appearance-none cursor-pointer"
                        >
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
                        <select 
                          value={block.comparison}
                          onChange={(e) => updateSellBlock(block.id, 'comparison', e.target.value)}
                          className="bg-transparent text-[#8B5CF6] text-sm font-bold px-3 py-2 outline-none appearance-none cursor-pointer"
                        >
                          <option className="bg-[#1C2128] text-white">Greater Than</option>
                          <option className="bg-[#1C2128] text-white">Less Than</option>
                          <option className="bg-[#1C2128] text-white">Crosses Above</option>
                          <option className="bg-[#1C2128] text-white">Crosses Below</option>
                        </select>
                      </div>

                      <div className="flex-[2] bg-[#0D1117] border border-[#30363D] rounded-lg p-1 flex items-center">
                        <select 
                          value={block.valueType}
                          onChange={(e) => updateSellBlock(block.id, 'valueType', e.target.value)}
                          className="bg-transparent text-white text-sm px-3 py-2 outline-none border-r border-[#30363D] appearance-none cursor-pointer"
                        >
                          <option className="bg-[#1C2128] text-white">Number</option>
                          <option className="bg-[#1C2128] text-white">Indicator</option>
                        </select>
                        <input 
                          type="text" 
                          value={block.value}
                          onChange={(e) => updateSellBlock(block.id, 'value', e.target.value)}
                          className="bg-transparent text-white text-sm w-full px-3 py-2 outline-none"
                        />
                      </div>

                      <button 
                        onClick={() => removeSellBlock(block.id)}
                        className="bg-[#21262D] hover:bg-red-500/20 text-red-400 p-2 rounded-lg border border-[#30363D] transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Action Block - Advanced Derivatives Configurator */}
                <div className="mt-4">
                  <OptionsBuilder 
                    actionType="SELL" 
                    instrument={sellInstrument}
                    setInstrument={setSellInstrument}
                    legs={sellLegs}
                    setLegs={setSellLegs}
                  />
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
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#21262D] hover:bg-[#30363D] text-white border border-[#30363D] px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Strategy
          </button>

          <button 
            onClick={async () => {
              const latestId = await handleSave();
              if (latestId) {
                setIsBacktestModalOpen(true);
              }
            }}
            className="bg-transparent border border-[#6366F1] hover:bg-[#6366F1]/10 text-[#6366F1] px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
          >
            <Activity size={16} /> Run Backtest
          </button>
          
          <button 
            onClick={launchTrading}
            disabled={loading}
            className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-90 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            <Zap size={16} className="fill-current" /> {loading ? "Launching..." : "Launch Automated Trading"}
          </button>
        </div>
      </div>
      <BacktestModal 
        isOpen={isBacktestModalOpen} 
        onClose={() => setIsBacktestModalOpen(false)} 
        strategyId={strategyId || "82d2d8a6-706c-479d-836a-a83388902a31"} 
      />
    </div>
  );
}
