import { createClient } from "@/lib/supabase/server";
import StrategyCard, { Strategy } from "@/components/marketplace/StrategyCard";
import { UserCheck, Star } from "lucide-react";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function CreatorProfilePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  
  // Fetch creator info
  const { data: creator, error: creatorError } = await supabase
    .from("users")
    .select("id, full_name, ra_verified, ra_license_no, created_at")
    .eq("id", params.id)
    .single();

  if (creatorError || !creator) {
    notFound();
  }

  // Fetch creator's live strategies
  const { data: strategies } = await supabase
    .from("marketplace_strategies")
    .select("*")
    .eq("creator_id", creator.id);

  const stats = {
    totalSubscribers: strategies?.reduce((acc, s) => acc + (s.subscriber_count || 0), 0) || 0,
    activeStrategies: strategies?.length || 0,
    avgCagr: strategies && strategies.length > 0 
      ? strategies.reduce((acc, s) => acc + (s.cagr || 0), 0) / strategies.length 
      : 0
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Creator Header */}
      <div className="bg-white/5 border-b border-white/10 pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl flex-shrink-0">
            {creator.full_name?.charAt(0) || "C"}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white flex items-center justify-center md:justify-start gap-3">
              {creator.full_name || "Anonymous Creator"}
              {creator.ra_verified && (
                <span className="flex items-center text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">
                  <UserCheck className="w-4 h-4 mr-1" /> SEBI RA Verified
                </span>
              )}
            </h1>
            
            <p className="text-white/60 mt-2 max-w-2xl">
              Member since {new Date(creator.created_at).getFullYear()}. 
              {creator.ra_verified && ` License: ${creator.ra_license_no}`}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6">
              <div className="text-center md:text-left">
                <p className="text-3xl font-bold text-white">{stats.activeStrategies}</p>
                <p className="text-sm text-white/50">Live Strategies</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-3xl font-bold text-white">{stats.totalSubscribers.toLocaleString()}</p>
                <p className="text-sm text-white/50">Total Subscribers</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-3xl font-bold text-green-400">+{stats.avgCagr.toFixed(1)}%</p>
                <p className="text-sm text-white/50">Avg. Strategy CAGR</p>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <button className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              Follow Creator
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-6">Published Strategies</h2>
        
        {strategies && strategies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {strategies.map((strategy: Strategy) => (
              <StrategyCard key={strategy.id} strategy={strategy} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border border-white/10 glass-panel rounded-xl text-white/50">
            This creator has no live strategies.
          </div>
        )}
      </div>
    </div>
  );
}
