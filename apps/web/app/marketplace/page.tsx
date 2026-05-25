import StrategyCard, { Strategy } from "@/components/marketplace/StrategyCard";
import MarketplaceFilters from "@/components/marketplace/MarketplaceFilters";
import MagicFilter from "@/components/marketplace/MagicFilter";

import { createClient } from "@/lib/supabase/server";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = await createClient();
  const { data: rawStrategies } = await supabase
    .from('strategies')
    .select('*')
    .eq('is_public_marketplace', true);

  let strategies: Strategy[] = (rawStrategies || []).map((row: any) => ({
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
  }));

  // Apply basic mock filters
  if (searchParams.classification && searchParams.classification !== "all") {
    strategies = strategies.filter(s => s.classification === searchParams.classification);
  }
  
  return (
    <div className="min-h-screen bg-[#0D1117] font-sans">
      {/* Hero Section */}
      <div className="bg-[#161B22] border-b border-[#30363D] relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-[#388BFD]/5 to-transparent z-0 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Discover Your Edge</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Browse and subscribe to institutional-grade algorithmic strategies built by verified experts.
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
              <div className="text-sm text-gray-500 font-medium">
                {strategies.length} Results
              </div>
            </div>

            {strategies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {strategies.map((strategy: Strategy) => (
                  <StrategyCard key={strategy.id} strategy={strategy} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center border border-[#30363D] bg-[#161B22] rounded-xl text-gray-500">
                No strategies found matching your filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
