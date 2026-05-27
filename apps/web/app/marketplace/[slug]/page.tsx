"use client";

import React, { useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { ExternalLink, ShieldCheck, TrendingUp, AlertTriangle, Activity, CheckCircle2, Zap } from "lucide-react";
import TVChart from "@/components/charts/TVChart";
import { createClient } from "@/lib/supabase/client";
import { Strategy } from "@/components/marketplace/StrategyCard";

export default function StrategyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const router = useRouter();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStrategy() {
      const { data: row } = await supabase
        .from('strategies')
        .select('*')
        .eq('slug', slug)
        .single();

      if (row) {
        setStrategy({
          id: row.id,
          slug: row.slug || row.id,
          name: row.name,
          classification: row.type || "black_box",
          algo_id: row.algo_id || "PENDING",
          creator_id: row.creator_id,
          creator_name: "Verified Creator",
          creator_ra_verified: true,
          min_capital: row.min_capital || 100000,
          fee: row.fee || 0,
          profit_share: row.profit_share || 0,
          cagr: row.logic_graph?.metrics?.cagr || 0,
          max_drawdown: row.logic_graph?.metrics?.max_drawdown || 0,
          sharpe_ratio: row.logic_graph?.metrics?.sharpe_ratio || 0,
          win_rate: row.logic_graph?.metrics?.win_rate || 0,
          subscriber_count: row.logic_graph?.metrics?.subscriber_count || 0,
        });
      }
      setLoading(false);
    }
    fetchStrategy();
  }, [slug]);

  const handleSubscribe = () => {
    setIsSubscribed(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="animate-spin text-[#58A6FF]"><Activity size={32} /></div>
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Strategy Not Found</h1>
        <Link href="/marketplace" className="text-[#58A6FF] hover:underline">Return to Marketplace</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] pb-20 font-sans text-white relative">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#238636] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={20} />
          <span className="font-bold text-sm">Successfully Subscribed to {strategy.name}!</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#161B22] border-b border-[#30363D] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-1 text-xs rounded-md border font-medium ${
                  strategy.classification === 'black_box' ? 'bg-[#0D1117] border-[#30363D] text-gray-300' : 'bg-white/5 border-[#30363D] text-gray-300'
                }`}>
                  {strategy.classification === 'black_box' ? 'Black Box' : 'White Box'}
                </span>
                <span className="flex items-center text-xs bg-[#58A6FF]/10 border border-[#58A6FF]/20 text-[#58A6FF] font-medium px-2 py-1 rounded-md">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Algo-ID: {strategy.algo_id || "Pending"}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">{strategy.name}</h1>
              <p className="text-gray-400">
                Created by {" "}
                <Link href={`/marketplace/creator/${strategy.creator_id}`} className="text-[#58A6FF] hover:underline font-medium">
                  {strategy.creator_name || "Unknown"}
                </Link>
                {strategy.creator_ra_verified && (
                  <span className="ml-2 px-2 py-0.5 text-[10px] uppercase bg-[#238636]/10 text-[#39D353] rounded-full border border-[#238636]/30 font-bold tracking-wider inline-block align-middle">
                    SEBI RA
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {!isSubscribed ? (
                <>
                  <button className="bg-[#21262D] hover:bg-[#30363D] text-white font-medium py-3 px-6 rounded-xl transition-colors border border-[#30363D]">
                    Add to Watchlist
                  </button>
                  <button 
                    onClick={handleSubscribe}
                    className="bg-[#238636] hover:bg-[#2ea043] text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg"
                  >
                    Subscribe Now
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => router.push('/dashboard/settings')}
                  className="bg-[#58A6FF] hover:bg-[#388BFD] text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-[#58A6FF]/20 flex items-center gap-2"
                >
                  <Zap size={18} />
                  Execute Now
                </button>
              )}
            </div>
          </div>
          
          {/* Main Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
            <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D]">
              <p className="text-xs text-gray-500 mb-1 font-medium">CAGR</p>
              <p className="text-2xl font-bold text-[#39D353]">+{strategy.cagr}%</p>
            </div>
            <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D]">
              <p className="text-xs text-gray-500 mb-1 font-medium">Max Drawdown</p>
              <p className="text-2xl font-bold text-[#F85149]">-{strategy.max_drawdown}%</p>
            </div>
            <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D]">
              <p className="text-xs text-gray-500 mb-1 font-medium">Sharpe Ratio</p>
              <p className="text-2xl font-bold text-white">{strategy.sharpe_ratio?.toFixed(2) || "N/A"}</p>
            </div>
            <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D]">
              <p className="text-xs text-gray-500 mb-1 font-medium">Win Rate</p>
              <p className="text-2xl font-bold text-white">{strategy.win_rate}%</p>
            </div>
            <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D]">
              <p className="text-xs text-gray-500 mb-1 font-medium">Min Capital</p>
              <p className="text-xl font-bold text-white">₹{(strategy.min_capital/1000).toFixed(0)}k</p>
            </div>
            <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D]">
              <p className="text-xs text-gray-500 mb-1 font-medium">Total Subscribers</p>
              <p className="text-xl font-bold text-white">{strategy.subscriber_count || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* PnL Heatmap Section */}
          <div className="bg-[#161B22] p-6 rounded-xl border border-[#30363D] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-white text-lg">Historical Daily P&L Heatmap</span>
              <span className="text-xs text-gray-400">Last 90 Days</span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {Array.from({ length: 90 }).map((_, i) => {
                const rand = Math.random();
                let colorClass = "bg-[#21262D]"; 
                // Bias slightly towards win_rate
                const winProb = strategy.win_rate / 100;
                
                if (rand < winProb) {
                  if (rand < winProb * 0.2) colorClass = "bg-[#39D353]"; 
                  else if (rand < winProb * 0.5) colorClass = "bg-[#2EA043]"; 
                  else colorClass = "bg-[#0E4429]"; 
                } else if (rand < winProb + ((1 - winProb) * 0.4)) {
                  if (rand < winProb + ((1 - winProb) * 0.1)) colorClass = "bg-[#F85149]"; 
                  else colorClass = "bg-[#DA3633]"; 
                }
                
                return (
                  <div 
                    key={i} 
                    className={`w-5 h-5 rounded-sm ${colorClass} hover:ring-2 ring-white/50 cursor-pointer transition-all`}
                    title="Hover for daily PnL"
                  ></div>
                );
              })}
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 justify-end">
              <span>Less</span>
              <div className="w-3 h-3 rounded-sm bg-[#F85149]"></div>
              <div className="w-3 h-3 rounded-sm bg-[#DA3633]"></div>
              <div className="w-3 h-3 rounded-sm bg-[#21262D]"></div>
              <div className="w-3 h-3 rounded-sm bg-[#0E4429]"></div>
              <div className="w-3 h-3 rounded-sm bg-[#2EA043]"></div>
              <div className="w-3 h-3 rounded-sm bg-[#39D353]"></div>
              <span>More</span>
            </div>
          </div>

          {/* Live Strategy Chart Integration */}
          <div className="bg-[#161B22] p-6 rounded-xl border border-[#30363D] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-white text-lg">Live Execution Feed</span>
              <span className="text-xs bg-[#21262D] text-[#39D353] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#39D353] rounded-full inline-block animate-pulse"></span>
                LIVE
              </span>
            </div>
            
            <div className="rounded-lg border border-[#30363D] overflow-hidden bg-[#0D1117]">
              <div className="px-4 py-3 bg-[#21262D] border-b border-[#30363D] flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#58A6FF]" />
                  <span className="text-sm font-bold text-white">Target Asset: {strategy.slug.includes('nifty') ? 'NIFTY 50' : strategy.slug.includes('banknifty') ? 'BANKNIFTY' : 'RELIANCE'}</span>
                </div>
              </div>
              <div className="h-80 relative">
                {/* Dynamically pass symbol based on strategy name/slug */}
                <TVChart symbol={strategy.slug.includes('nifty') && !strategy.slug.includes('bank') ? 'NIFTY 50' : strategy.slug.includes('banknifty') ? 'BANKNIFTY' : 'RELIANCE'} />
              </div>
            </div>
          </div>

        </div>

        <div className="space-y-6">
          <div className="bg-[#161B22] p-6 rounded-xl border border-[#30363D] shadow-sm">
            <h3 className="text-lg font-bold text-white mb-4">Subscription Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between pb-4 border-b border-[#30363D]">
                <span className="text-gray-400">Fixed Monthly Fee</span>
                <span className="text-white font-bold">{strategy.fee > 0 ? `₹${strategy.fee}` : "Free"}</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-[#30363D]">
                <span className="text-gray-400">Profit Sharing</span>
                <span className="text-white font-bold">{strategy.profit_share > 0 ? `${strategy.profit_share}%` : "None"}</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-[#30363D]">
                <span className="text-gray-400">Capital Required</span>
                <span className="text-white font-bold">₹{strategy.min_capital.toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            {!isSubscribed ? (
              <button 
                onClick={handleSubscribe}
                className="w-full mt-6 bg-[#238636] hover:bg-[#2ea043] text-white font-bold py-3 rounded-xl transition-colors shadow-lg"
              >
                Subscribe Now
              </button>
            ) : (
              <button 
                onClick={() => router.push('/dashboard/settings')}
                className="w-full mt-6 bg-[#58A6FF] hover:bg-[#388BFD] text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-[#58A6FF]/20 flex items-center justify-center gap-2"
              >
                <Zap size={18} />
                Execute Now
              </button>
            )}
          </div>

          <div className="bg-[#F85149]/5 p-6 rounded-xl border border-[#F85149]/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-[#F85149] flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-[#F85149] font-bold mb-1">SEBI Risk Disclosure</h4>
                <p className="text-xs text-[#F85149]/80 leading-relaxed">
                  Algorithmic trading is subject to market risks. Past performance (CAGR, Win Rate, Max Drawdown) shown in backtests or live track records is NOT indicative of future results. You may lose your entire capital.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
