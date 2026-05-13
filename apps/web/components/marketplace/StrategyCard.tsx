"use client";

import Link from "next/link";
import { Bookmark, TrendingUp, Users, Activity, ExternalLink } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Strategy {
  id: string;
  slug: string;
  name: string;
  classification: "white_box" | "black_box";
  algo_id: string;
  creator_id: string;
  creator_name: string;
  creator_ra_verified: boolean;
  min_capital: number;
  fee: number;
  profit_share: number;
  cagr: number;
  max_drawdown: number;
  sharpe_ratio: number;
  win_rate: number;
  subscriber_count: number;
}

interface Props {
  strategy: Strategy;
  isWatchlisted?: boolean;
}

export default function StrategyCard({ strategy, isWatchlisted = false }: Props) {
  const [bookmarked, setBookmarked] = useState(isWatchlisted);
  const supabase = createClient();

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Please sign in to bookmark strategies");

    if (bookmarked) {
      await supabase.from("user_watchlist").delete().match({ user_id: user.id, strategy_id: strategy.id });
      setBookmarked(false);
    } else {
      await supabase.from("user_watchlist").insert({ user_id: user.id, strategy_id: strategy.id });
      setBookmarked(true);
    }
  };

  return (
    <Link href={`/marketplace/${strategy.slug || strategy.id}`} className="block">
      <div className="glass-panel rounded-2xl border border-white/10 hover:border-primary/50 transition-colors group overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                {strategy.name}
              </h3>
              <p className="text-sm text-white/60 mt-1 flex items-center">
                by {strategy.creator_name || "Unknown"}
                {strategy.creator_ra_verified && (
                  <span className="ml-2 px-2 py-0.5 text-[10px] uppercase bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                    SEBI RA
                  </span>
                )}
              </p>
            </div>
            <button 
              onClick={toggleBookmark}
              className={`p-2 rounded-full transition-colors ${bookmarked ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
            >
              <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
          
          <div className="flex gap-2 mt-4">
            <span className={`px-2 py-1 text-xs rounded-md border ${
              strategy.classification === 'black_box' ? 'bg-black/50 border-white/20 text-white' : 'bg-white/10 border-white/20 text-white'
            }`}>
              {strategy.classification === 'black_box' ? 'Black Box' : 'White Box'}
            </span>
            <span className="px-2 py-1 text-xs bg-primary/10 border border-primary/20 text-primary rounded-md">
              {strategy.algo_id ? "Algo-ID verified" : "Algo-ID Pending"}
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="p-5 grid grid-cols-2 gap-4 flex-grow">
          <div>
            <p className="text-xs text-white/50 mb-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> CAGR</p>
            <p className="text-xl font-bold text-green-400">+{strategy.cagr}%</p>
          </div>
          <div>
            <p className="text-xs text-white/50 mb-1 flex items-center"><Activity className="w-3 h-3 mr-1" /> Max DD</p>
            <p className="text-xl font-bold text-red-400">-{strategy.max_drawdown}%</p>
          </div>
          <div>
            <p className="text-xs text-white/50 mb-1">Sharpe</p>
            <p className="text-lg font-semibold text-white">{strategy.sharpe_ratio.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-white/50 mb-1">Win Rate</p>
            <p className="text-lg font-semibold text-white">{strategy.win_rate}%</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10 bg-black/20 flex items-center justify-between mt-auto">
          <div>
            <p className="text-xs text-white/50">Capital required</p>
            <p className="font-semibold text-white">₹{strategy.min_capital.toLocaleString('en-IN')}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/50">Fee structure</p>
            <p className="font-semibold text-white">
              {strategy.fee > 0 ? `₹${strategy.fee}/mo` : "Free"} 
              {strategy.profit_share > 0 && ` + ${strategy.profit_share}% PF`}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
