import { createClient } from "@/lib/supabase/server";
import StrategyCard, { Strategy } from "@/components/marketplace/StrategyCard";
import MarketplaceFilters from "@/components/marketplace/MarketplaceFilters";
import MagicFilter from "@/components/marketplace/MagicFilter";

export const revalidate = 60; // ISR: Revalidate every 60 seconds

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = await createClient();
  
  let query = supabase.from("marketplace_strategies").select("*");

  // Apply filters from URL search params
  if (searchParams.classification && searchParams.classification !== "all") {
    query = query.eq("classification", searchParams.classification);
  }
  if (searchParams.minCagr) {
    query = query.gte("cagr", searchParams.minCagr);
  }
  if (searchParams.maxDd) {
    query = query.lte("max_drawdown", searchParams.maxDd);
  }
  if (searchParams.minCapital) {
    query = query.lte("min_capital", searchParams.minCapital);
  }

  // Fetch strategies
  const { data: strategies, error } = await query;

  // Ideally, fetch user's watchlist to pass `isWatchlisted` state to StrategyCard
  // For ISR pages, passing user-specific state requires client-side fetching or hydrating,
  // but for now we'll rely on the client component to handle its own bookmark state if needed
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-[url('/bg-abstract.jpg')] bg-cover bg-center relative py-20 px-4">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Discover Your Edge</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
            Browse and subscribe to SEBI-compliant algorithmic strategies built by verified experts.
          </p>
          
          <MagicFilter />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 flex-shrink-0">
            <MarketplaceFilters />
          </div>

          {/* Strategy Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">All Strategies</h2>
              <div className="text-sm text-white/50">
                {strategies?.length || 0} Results
              </div>
            </div>

            {error ? (
              <div className="p-8 text-center border border-red-500/20 bg-red-500/10 rounded-xl text-red-400">
                Failed to load strategies. Please try again later.
              </div>
            ) : strategies && strategies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {strategies.map((strategy: Strategy) => (
                  <StrategyCard key={strategy.id} strategy={strategy} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center border border-white/10 glass-panel rounded-xl text-white/50">
                No strategies found matching your filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
