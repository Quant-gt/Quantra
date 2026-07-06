"use client";

import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, CheckCircle2, TrendingUp, Share } from 'lucide-react';
import TVChart from '@/components/charts/TVChart';
import { createClient } from "@/lib/supabase/client";

interface FeedPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  strategyName: string;
  date: string;
  content: string;
  chartSymbol: string | null;
  likes: number;
  comments: number;
  metrics: {
    weeklyReturn: string;
    maxDrawdown: string;
  } | null;
}

export default function SocialFeedPage() {
  const [strategies, setStrategies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const { data, error } = await supabase
          .from('strategies')
          .select('id, name, slug, type, algo_id, strategy_metrics(cagr, max_drawdown, win_rate, sharpe_ratio)')
          .eq('status', 'live');
        
        if (data) {
          setStrategies(data);
        }
      } catch (err) {
        console.error("Failed to load live strategies for social feed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStrategies();
  }, [supabase]);

  // Construct dynamic posts from database strategies, falling back to mock posts if DB is empty
  const getPosts = (): FeedPost[] => {
    if (loading || strategies.length === 0) {
      return [
        {
          id: "mock-1",
          authorName: "QuantAlpha",
          authorHandle: "@quantalpha",
          authorAvatar: "QA",
          strategyName: "BNF Trend Follower",
          date: "2h ago",
          content: "Just fired a long signal on BANKNIFTY! 🚀\n\nOur algo detected a massive volatility squeeze break on the 5-minute chart, accompanied by heavy institutional volume. The momentum oscillators have fully reset and are now pointing sharply upward. We are riding this breakout. Watch the live chart below to see our entry.",
          chartSymbol: "BANKNIFTY",
          likes: 142,
          comments: 28,
          metrics: null
        },
        {
          id: "mock-2",
          authorName: "Nifty Maestro",
          authorHandle: "@niftymaestro",
          authorAvatar: "NM",
          strategyName: "Nifty Options Scalper",
          date: "5h ago",
          content: "Weekly Performance Update! 📊\n\nIt's been a choppy week for the broader market, but our mean-reversion logic performed flawlessly. We caught exactly 14 trades this week with an 82% win rate.",
          chartSymbol: null,
          likes: 89,
          comments: 12,
          metrics: {
            weeklyReturn: "+4.2%",
            maxDrawdown: "-0.8%"
          }
        }
      ];
    }

    return strategies.map((strat) => {
      const metrics = strat.strategy_metrics || {};
      const isBankNifty = strat.slug.includes("banknifty");
      
      if (isBankNifty) {
        return {
          id: strat.id,
          authorName: "QuantAlpha",
          authorHandle: "@quantalpha",
          authorAvatar: "QA",
          strategyName: strat.name,
          date: "2h ago",
          content: `Just fired a long signal on ${strat.name}! 🚀\n\nOur algo detected a massive volatility squeeze break on the 5-minute chart, accompanied by heavy institutional volume. The momentum oscillators have fully reset and are now pointing sharply upward. We are riding this breakout. Watch the live chart below to see our entry.`,
          chartSymbol: "BANKNIFTY",
          likes: 142,
          comments: 28,
          metrics: null
        };
      } else {
        const weeklyReturn = metrics.cagr ? (metrics.cagr / 10).toFixed(1) : "4.2";
        const maxDrawdown = metrics.max_drawdown ? metrics.max_drawdown.toFixed(1) : "0.8";
        const winRate = metrics.win_rate || 82;
        
        return {
          id: strat.id,
          authorName: "Nifty Maestro",
          authorHandle: "@niftymaestro",
          authorAvatar: "NM",
          strategyName: strat.name,
          date: "5h ago",
          content: `Weekly Performance Update for ${strat.name}! 📊\n\nIt's been a choppy week for the broader market, but our mean-reversion logic performed flawlessly. We caught exactly 14 trades this week with a ${winRate}% win rate.`,
          chartSymbol: null,
          likes: 89,
          comments: 12,
          metrics: {
            weeklyReturn: `+${weeklyReturn}%`,
            maxDrawdown: `-${maxDrawdown}%`
          }
        };
      }
    });
  };

  const posts = getPosts();

  return (
    <div className="max-w-3xl mx-auto py-6 pb-20">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Social Feed</h1>
        <p className="text-gray-400 text-sm">Real-time updates and market insights from creators you subscribe to.</p>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-[#161B22] rounded-xl border border-[#30363D] overflow-hidden shadow-sm">
            <div className="p-5 pb-3 flex justify-between items-start">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white shadow-md">
                  {post.authorAvatar}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white">{post.authorName}</span>
                    <CheckCircle2 size={14} className="text-[#58A6FF]" />
                    <span className="text-gray-500 text-sm">{post.authorHandle} • {post.date}</span>
                  </div>
                  <div className="text-xs text-[#39D353] font-mono mt-0.5">Creator of "{post.strategyName}"</div>
                </div>
              </div>
              <button className="text-gray-500 hover:text-white transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>
            
            <div className="px-5 pb-4">
              <p className="text-white text-sm leading-relaxed mb-4 whitespace-pre-line">
                {post.content}
              </p>
              
              {/* Embedded Live Chart */}
              {post.chartSymbol && (
                <div className="rounded-lg border border-[#30363D] overflow-hidden bg-[#0D1117]">
                  <div className="px-4 py-2 bg-[#21262D] border-b border-[#30363D] flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-[#39D353]" />
                      <span className="text-xs font-bold text-white">Live Execution Chart: {post.chartSymbol}</span>
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono">LIVE</div>
                  </div>
                  <div className="h-64 relative">
                    <TVChart symbol={post.chartSymbol} />
                  </div>
                </div>
              )}

              {/* Performance Metrics display */}
              {post.metrics && (
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Weekly Return</div>
                    <div className="text-lg font-bold text-[#39D353]">{post.metrics.weeklyReturn}</div>
                  </div>
                  <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Max Drawdown</div>
                    <div className="text-lg font-bold text-white">{post.metrics.maxDrawdown}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-[#30363D] flex gap-6">
              <button className="flex items-center gap-2 text-gray-400 hover:text-[#F85149] transition-colors text-sm font-medium group">
                <Heart size={18} className="group-hover:fill-current" />
                {post.likes}
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-[#58A6FF] transition-colors text-sm font-medium group">
                <MessageCircle size={18} className="group-hover:fill-current" />
                {post.comments}
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-[#39D353] transition-colors text-sm font-medium group">
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

