"use client";

import Link from "next/link";
import { Bookmark, TrendingUp, Users, Activity, ExternalLink } from "lucide-react";
import React, { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import CheckoutModal from "./CheckoutModal";

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

const StrategyCard = React.memo(({ strategy, isWatchlisted = false }: Props) => {
  const [bookmarked, setBookmarked] = useState(isWatchlisted);
  const [showCheckout, setShowCheckout] = useState(false);

  const toggleBookmark = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in to bookmark strategies");
      return;
    }

    if (bookmarked) {
      await supabase.from("user_watchlist").delete().match({ user_id: user.id, strategy_id: strategy.id });
      setBookmarked(false);
    } else {
      await supabase.from("user_watchlist").insert({ user_id: user.id, strategy_id: strategy.id });
      setBookmarked(true);
    }
  }, [bookmarked, strategy.id]);

  const handleSubscribe = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCheckout(true);
  }, []);

  return (
    <>
      <Link href={`/marketplace/${strategy.slug || strategy.id}`} className="block h-full">
        <div className="bg-[#161B22] rounded-2xl border border-[#30363D] hover:border-[#58A6FF] transition-colors group overflow-hidden h-full flex flex-col shadow-sm">
          {/* Header */}
          <div className="p-5 border-b border-[#30363D]">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-[#58A6FF] transition-colors">
                  {strategy.name}
                </h3>
                <p className="text-sm text-gray-400 mt-1 flex items-center">
                  by {strategy.creator_name || "Unknown"}
                  {strategy.creator_ra_verified && (
                    <span className="ml-2 px-2 py-0.5 text-[10px] uppercase bg-[#238636]/10 text-[#39D353] rounded-full border border-[#238636]/30 font-bold tracking-wider">
                      SEBI RA
                    </span>
                  )}
                </p>
              </div>
              <button 
                onClick={toggleBookmark}
                className={`p-2 rounded-full transition-colors ${bookmarked ? 'bg-[#58A6FF]/20 text-[#58A6FF]' : 'bg-[#21262D] text-gray-500 hover:bg-[#30363D] hover:text-white'}`}
              >
                <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
            
            <div className="flex gap-2 mt-4">
              <span className={`px-2 py-1 text-xs rounded-md border font-medium ${
                strategy.classification === 'black_box' ? 'bg-[#0D1117] border-[#30363D] text-gray-300' : 'bg-white/5 border-[#30363D] text-gray-300'
              }`}>
                {strategy.classification === 'black_box' ? 'Black Box' : 'White Box'}
              </span>
              <span className="px-2 py-1 text-xs bg-[#58A6FF]/10 border border-[#58A6FF]/20 text-[#58A6FF] font-medium rounded-md">
                {strategy.algo_id ? "Algo-ID verified" : "Algo-ID Pending"}
              </span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="p-5 grid grid-cols-2 gap-4 flex-grow bg-[#0D1117]/50">
            <div>
              <p className="text-xs text-gray-500 mb-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> CAGR</p>
              <p className="text-xl font-bold text-[#39D353]">+{strategy.cagr}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1 flex items-center"><Activity className="w-3 h-3 mr-1" /> Max DD</p>
              <p className="text-xl font-bold text-[#F85149]">-{strategy.max_drawdown}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Sharpe</p>
              <p className="text-lg font-semibold text-white">{strategy.sharpe_ratio.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Win Rate</p>
              <p className="text-lg font-semibold text-white">{strategy.win_rate}%</p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-[#30363D] bg-[#161B22] flex items-center justify-between mt-auto">
            <div>
              <p className="text-xs text-gray-500">Capital required</p>
              <p className="font-semibold text-white">₹{strategy.min_capital.toLocaleString('en-IN')}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Fee structure</p>
              <p className="font-semibold text-white">
                {strategy.fee > 0 ? `₹${strategy.fee}/mo` : "Free"} 
                {strategy.profit_share > 0 && ` + ${strategy.profit_share}% PF`}
              </p>
            </div>
          </div>
          
          <div className="px-5 pb-5 bg-[#161B22]">
            <button 
              onClick={handleSubscribe}
              className="w-full bg-[#58A6FF]/10 hover:bg-[#58A6FF]/20 text-[#58A6FF] font-bold py-2.5 px-4 rounded-lg transition-colors border border-[#58A6FF]/20"
            >
              Subscribe
            </button>
          </div>
        </div>
      </Link>

      <CheckoutModal strategy={strategy} isOpen={showCheckout} onClose={() => setShowCheckout(false)} />
    </>
  );
});

StrategyCard.displayName = "StrategyCard";
export default StrategyCard;
