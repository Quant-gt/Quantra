import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import StrategyAnalytics from "@/components/marketplace/StrategyAnalytics";
import WhiteBoxViewer from "@/components/marketplace/WhiteBoxViewer";
import Link from "next/link";
import { ExternalLink, ShieldCheck, TrendingUp, AlertTriangle } from "lucide-react";

export const revalidate = 60; // ISR 60 seconds

export default async function StrategyDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  
  const { data: strategy, error } = await supabase
    .from("marketplace_strategies")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !strategy) {
    // If we can't find by slug, try by ID as a fallback
    const { data: fallback, error: fbError } = await supabase
      .from("marketplace_strategies")
      .select("*")
      .eq("id", params.slug)
      .single();
      
    if (fbError || !fallback) notFound();
    Object.assign(strategy || {}, fallback);
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-1 text-xs rounded-md border ${
                  strategy.classification === 'black_box' ? 'bg-black/50 border-white/20' : 'bg-white/10 border-white/20'
                } text-white`}>
                  {strategy.classification === 'black_box' ? 'Black Box' : 'White Box'}
                </span>
                <span className="flex items-center text-xs bg-primary/10 border border-primary/20 text-primary px-2 py-1 rounded-md">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Algo-ID: {strategy.algo_id || "Pending"}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{strategy.name}</h1>
              <p className="text-white/60">
                Created by {" "}
                <Link href={`/marketplace/creator/${strategy.creator_id}`} className="text-primary hover:underline">
                  {strategy.creator_name || "Unknown"}
                </Link>
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-colors border border-white/10">
                Add to Watchlist
              </button>
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-primary/20">
                Subscribe Now
              </button>
            </div>
          </div>
          
          {/* Main 9 Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
            <div className="glass-panel p-4 rounded-xl border border-white/10">
              <p className="text-xs text-white/50 mb-1">CAGR</p>
              <p className="text-2xl font-bold text-green-400">+{strategy.cagr}%</p>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-white/10">
              <p className="text-xs text-white/50 mb-1">Max Drawdown</p>
              <p className="text-2xl font-bold text-red-400">-{strategy.max_drawdown}%</p>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-white/10">
              <p className="text-xs text-white/50 mb-1">Sharpe Ratio</p>
              <p className="text-2xl font-bold text-white">{strategy.sharpe_ratio?.toFixed(2) || "N/A"}</p>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-white/10">
              <p className="text-xs text-white/50 mb-1">Win Rate</p>
              <p className="text-2xl font-bold text-white">{strategy.win_rate}%</p>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-white/10">
              <p className="text-xs text-white/50 mb-1">Min Capital</p>
              <p className="text-xl font-bold text-white">₹{(strategy.min_capital/1000).toFixed(0)}k</p>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-white/10">
              <p className="text-xs text-white/50 mb-1">Total Subscribers</p>
              <p className="text-xl font-bold text-white">{strategy.subscriber_count || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <StrategyAnalytics />

          {strategy.classification === 'white_box' && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Strategy Logic (White Box)</h3>
              <p className="text-white/60 text-sm">This creator has made their trading rules fully transparent. You can view the logic graph below.</p>
              <WhiteBoxViewer />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Subscription Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between pb-4 border-b border-white/10">
                <span className="text-white/60">Fixed Monthly Fee</span>
                <span className="text-white font-bold">{strategy.fee > 0 ? `₹${strategy.fee}` : "Free"}</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-white/10">
                <span className="text-white/60">Profit Sharing</span>
                <span className="text-white font-bold">{strategy.profit_share > 0 ? `${strategy.profit_share}%` : "None"}</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-white/10">
                <span className="text-white/60">Capital Required</span>
                <span className="text-white font-bold">₹{strategy.min_capital.toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            <button className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl transition-colors">
              Subscribe Now
            </button>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-red-500/20 bg-red-500/5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-red-400 font-bold mb-1">SEBI Risk Disclosure</h4>
                <p className="text-xs text-red-400/80 leading-relaxed">
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
