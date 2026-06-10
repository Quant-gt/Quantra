"use client";

import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, CheckCircle2, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import TVChart from '@/components/charts/TVChart';

export default function SocialFeedPage() {
  return (
    <div className="max-w-3xl mx-auto py-6 pb-20">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Social Feed</h1>
        <p className="text-gray-400 text-sm">Real-time updates and market insights from creators you subscribe to.</p>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        
        {/* Post 1: Embedded TV Chart */}
        <div className="bg-[#161B22] rounded-xl border border-[#30363D] overflow-hidden shadow-sm">
          <div className="p-5 pb-3 flex justify-between items-start">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white shadow-md">
                QA
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white">QuantAlpha</span>
                  <CheckCircle2 size={14} className="text-[#58A6FF]" />
                  <span className="text-gray-500 text-sm">@quantalpha • 2h</span>
                </div>
                <div className="text-xs text-[#39D353] font-mono mt-0.5">Creator of "BNF Trend Follower"</div>
              </div>
            </div>
            <button className="text-gray-500 hover:text-white transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
          
          <div className="px-5 pb-4">
            <p className="text-white text-sm leading-relaxed mb-4">
              Just fired a long signal on <span className="font-bold text-[#58A6FF]">BANKNIFTY</span>! 🚀
              <br/><br/>
              Our algo detected a massive volatility squeeze break on the 5-minute chart, accompanied by heavy institutional volume. The momentum oscillators have fully reset and are now pointing sharply upward. We are riding this breakout. Watch the live chart below to see our entry.
            </p>
            
            {/* Embedded Live Chart */}
            <div className="rounded-lg border border-[#30363D] overflow-hidden bg-[#0D1117]">
              <div className="px-4 py-2 bg-[#21262D] border-b border-[#30363D] flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#39D353]" />
                  <span className="text-xs font-bold text-white">Live Execution Chart: BANKNIFTY</span>
                </div>
                <div className="text-[10px] text-gray-400 font-mono">LIVE</div>
              </div>
              <div className="h-64 relative">
                <TVChart symbol="BANKNIFTY" />
              </div>
            </div>
          </div>

          <div className="px-5 py-3 border-t border-[#30363D] flex gap-6">
            <button className="flex items-center gap-2 text-gray-400 hover:text-[#F85149] transition-colors text-sm font-medium group">
              <Heart size={18} className="group-hover:fill-current" />
              142
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-[#58A6FF] transition-colors text-sm font-medium group">
              <MessageCircle size={18} className="group-hover:fill-current" />
              28
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-[#39D353] transition-colors text-sm font-medium group">
              <Share2 size={18} />
              Share
            </button>
          </div>
        </div>

        {/* Post 2: Performance Update */}
        <div className="bg-[#161B22] rounded-xl border border-[#30363D] overflow-hidden shadow-sm">
          <div className="p-5 pb-3 flex justify-between items-start">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-[#30363D] rounded-full flex items-center justify-center font-bold text-white shadow-md">
                NM
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white">Nifty Maestro</span>
                  <CheckCircle2 size={14} className="text-[#58A6FF]" />
                  <span className="text-gray-500 text-sm">@niftymaestro • 5h</span>
                </div>
                <div className="text-xs text-[#39D353] font-mono mt-0.5">Creator of "Nifty Options Scalper"</div>
              </div>
            </div>
            <button className="text-gray-500 hover:text-white transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
          
          <div className="px-5 pb-4">
            <p className="text-white text-sm leading-relaxed mb-4">
              Weekly Performance Update! 📊
              <br/><br/>
              It's been a choppy week for the broader market, but our mean-reversion logic performed flawlessly. We caught exactly 14 trades this week with an 82% win rate.
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Weekly Return</div>
                <div className="text-lg font-bold text-[#39D353]">+4.2%</div>
              </div>
              <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Max Drawdown</div>
                <div className="text-lg font-bold text-white">-0.8%</div>
              </div>
            </div>
          </div>

          <div className="px-5 py-3 border-t border-[#30363D] flex gap-6">
            <button className="flex items-center gap-2 text-gray-400 hover:text-[#F85149] transition-colors text-sm font-medium group">
              <Heart size={18} className="group-hover:fill-current" />
              89
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-[#58A6FF] transition-colors text-sm font-medium group">
              <MessageCircle size={18} className="group-hover:fill-current" />
              12
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-[#39D353] transition-colors text-sm font-medium group">
              <Share2 size={18} />
              Share
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

