"use client";
import { toast } from "sonner";

import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowRight, Brain, Zap, Target, ShieldCheck } from 'lucide-react';
import { createClient } from "@/lib/supabase/client";

export default function AICreatorPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<any>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    
    setLoading(true);
    setStrategy(null);
    setPublishSuccess(false);

    try {
      const res = await fetch('/api/v1/admin/ai-creator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      
      if (data.success) {
        setStrategy(data.data);
      } else {
        toast.error("Error: " + data.error);
      }
    } catch (err) {
      toast.error("Network error while communicating with AI.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!strategy) return;
    setPublishing(true);
    
    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      
      const insertData = {
        name: strategy.name,
        type: strategy.classification,
        is_public_marketplace: true,
        creator_id: userData.user?.id || 'admin-ai-system',
        min_capital: strategy.min_capital,
        fee: 2999,
        profit_share: 0,
        algo_id: 'AI-GEN-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        logic_graph: {
          metrics: {
            cagr: strategy.expected_cagr,
            max_drawdown: strategy.expected_max_drawdown,
            sharpe_ratio: Number((strategy.expected_cagr / strategy.expected_max_drawdown).toFixed(2)),
            win_rate: strategy.expected_win_rate,
            subscriber_count: 0
          },
          ai_logic: strategy.logic
        }
      };

      const { error } = await supabase.from('strategies').insert(insertData);
      
      if (error) {
        console.error(error);
        toast.error("Failed to publish to database. Check console for details.");
      } else {
        setPublishSuccess(true);
      }
    } catch (err) {
      toast.error("Error publishing strategy.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#58A6FF] to-purple-500 flex items-center gap-3">
          <Sparkles className="text-[#58A6FF]" size={32} />
          AI Strategy Creator
        </h1>
        <p className="text-gray-400 mt-2">
          Leverage Google's Gemini AI to instantly formulate high-strike-rate quantitative strategies.
        </p>
      </div>

      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-xl mb-8">
        <form onSubmit={handleGenerate}>
          <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Brain size={16} className="text-purple-400"/> Describe your strategy idea
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 bg-[#0D1117] border border-[#30363D] focus:border-[#58A6FF] rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#58A6FF] resize-none transition-all"
            placeholder="e.g. Create a mean reversion strategy for Nifty options using RSI divergence and Bollinger Band bounces on a 5-minute timeframe, aiming for a 90% strike rate."
          />
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading || !prompt}
              className="bg-[#58A6FF] hover:bg-[#388BFD] text-black font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={20} /> Synthesizing Logic...</>
              ) : (
                <><Sparkles size={20} /> Generate AI Strategy</>
              )}
            </button>
          </div>
        </form>
      </div>

      {strategy && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-[#0B0F19] border border-[#58A6FF]/30 rounded-2xl shadow-[0_0_40px_rgba(88,166,255,0.1)] overflow-hidden">
            
            {/* Header */}
            <div className="p-6 border-b border-[#30363D] bg-gradient-to-r from-[#161B22] to-[#0B0F19] flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold rounded-full uppercase tracking-widest flex items-center gap-1">
                    <Sparkles size={12}/> Gemini Generated
                  </span>
                  <span className="px-3 py-1 bg-[#238636]/20 text-[#39D353] border border-[#238636]/30 text-xs font-bold rounded-full uppercase">
                    {strategy.classification === 'black_box' ? 'Black Box' : 'White Box'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white">{strategy.name}</h2>
                <p className="text-gray-400 mt-1">{strategy.description}</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 divide-x-0 md:divide-x divide-[#30363D] border-b border-[#30363D] bg-[#161B22]/50">
              <div className="p-6 text-center">
                <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Win Rate</p>
                <p className="text-2xl font-black text-[#39D353] flex items-center justify-center gap-1">
                  <Target size={20}/> {strategy.expected_win_rate}%
                </p>
              </div>
              <div className="p-6 text-center">
                <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Est. CAGR</p>
                <p className="text-2xl font-black text-white">+{strategy.expected_cagr}%</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Max Drawdown</p>
                <p className="text-2xl font-black text-[#F85149]">-{strategy.expected_max_drawdown}%</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Min Capital</p>
                <p className="text-2xl font-black text-white">₹{strategy.min_capital?.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Logic Breakdown */}
            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0D1117]">
              <div>
                <h3 className="text-[#58A6FF] font-bold mb-4 flex items-center gap-2"><Zap size={18}/> Entry Rules</h3>
                <ul className="space-y-3">
                  {strategy.logic?.entry_rules?.map((rule: string, i: number) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-300 bg-[#161B22] p-3 rounded-lg border border-[#30363D]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#58A6FF] mt-1.5 shrink-0"></div>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2"><ShieldCheck size={18}/> Exit Rules & Risk</h3>
                <ul className="space-y-3 mb-4">
                  {strategy.logic?.exit_rules?.map((rule: string, i: number) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-300 bg-[#161B22] p-3 rounded-lg border border-[#30363D]">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0"></div>
                      {rule}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-4">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex-1">
                    <p className="text-xs text-red-400 uppercase font-bold mb-1">Stop Loss</p>
                    <p className="text-lg text-white font-mono">{strategy.logic?.stop_loss_pct}%</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex-1">
                    <p className="text-xs text-green-400 uppercase font-bold mb-1">Take Profit</p>
                    <p className="text-lg text-white font-mono">{strategy.logic?.take_profit_pct}%</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Bar */}
            <div className="p-4 md:p-6 bg-[#161B22] border-t border-[#30363D] flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Brain size={16} className="text-gray-500"/>
                Indicators used: {strategy.logic?.indicators?.join(', ')}
              </div>
              
              <button
                onClick={handlePublish}
                disabled={publishing || publishSuccess}
                className={`py-3 px-6 rounded-xl font-bold transition-all flex items-center gap-2 ${
                  publishSuccess 
                    ? 'bg-[#238636] text-white cursor-default'
                    : 'bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                }`}
              >
                {publishing ? (
                  <><Loader2 className="animate-spin" size={20} /> Publishing to Marketplace...</>
                ) : publishSuccess ? (
                  <><ShieldCheck size={20} /> Published Successfully!</>
                ) : (
                  <>Publish to Marketplace <ArrowRight size={20} /></>
                )}
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}


