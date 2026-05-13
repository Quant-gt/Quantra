import { createClient } from "@/lib/supabase/server";
import StrategyCard, { Strategy } from "@/components/marketplace/StrategyCard";
import { redirect } from "next/navigation";

export default async function WatchlistPage() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth");
  }

  // Fetch watchlisted strategies
  const { data: watchlist, error } = await supabase
    .from("user_watchlist")
    .select(`
      strategy_id,
      marketplace_strategies (*)
    `)
    .eq("user_id", user.id);

  const strategies = watchlist?.map(w => w.marketplace_strategies).filter(Boolean) as Strategy[] || [];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold text-white mb-2">My Watchlist</h1>
          <p className="text-white/60">
            Track and monitor strategies before subscribing.
          </p>
        </div>

        {error ? (
          <div className="p-8 text-center border border-red-500/20 bg-red-500/10 rounded-xl text-red-400">
            Failed to load watchlist.
          </div>
        ) : strategies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {strategies.map((strategy) => (
              <StrategyCard key={strategy.id} strategy={strategy} isWatchlisted={true} />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center border border-white/10 glass-panel rounded-xl">
            <h3 className="text-xl font-bold text-white mb-2">Your watchlist is empty</h3>
            <p className="text-white/50 mb-6">Explore the marketplace to find strategies that fit your profile.</p>
            <a href="/marketplace" className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-semibold hover:bg-primary/90 transition-colors">
              Browse Marketplace
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
