"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function OPSDashboard() {
  const [ops, setOps] = useState<number>(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchOps = async () => {
      try {
        const { data } = await supabase
          .from('marketplace_subscriptions')
          .select('current_ops')
          .eq('status', 'active')
          .limit(1);
        
        if (data && data[0]) {
          setOps(Number(data[0].current_ops) || 0);
        } else {
          // If no active subscriptions, defaults to 0 OPS
          setOps(0);
        }
      } catch (err) {
        // ignore fetch errors on unmounted component
      }
    };

    fetchOps();
    const interval = setInterval(fetchOps, 2000);
    return () => clearInterval(interval);
  }, [supabase]);

  const getStatusColor = () => {
    if (ops >= 9.5) return "text-red-500 bg-red-500/10 border-red-500/30";
    if (ops >= 8.0) return "text-amber-500 bg-amber-500/10 border-amber-500/30";
    return "text-green-500 bg-green-500/10 border-green-500/30";
  };

  const getProgressWidth = () => {
    return `${Math.min((ops / 10) * 100, 100)}%`;
  };

  const getProgressColor = () => {
    if (ops >= 9.5) return "bg-red-500";
    if (ops >= 8.0) return "bg-amber-500";
    return "bg-green-500";
  };

  return (
    <div className="glass-panel p-6 rounded-xl border border-white/10 w-full max-w-lg">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Real-time OPS Monitor</h2>
          <p className="text-sm text-white/60">SEBI Mandate: Max 10 Orders Per Second</p>
        </div>
        <div className={`px-3 py-1 rounded-full border font-bold text-lg ${getStatusColor()}`}>
          {ops.toFixed(1)} OPS
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-xs text-white/60 font-medium">
          <span>0</span>
          <span>8</span>
          <span>9.5</span>
          <span>10 (Throttle)</span>
        </div>
        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/10">
          {/* Markers */}
          <div className="absolute top-0 bottom-0 left-[80%] w-px bg-white/20 z-10" />
          <div className="absolute top-0 bottom-0 left-[95%] w-px bg-white/20 z-10" />
          
          <div 
            className={`h-full transition-all duration-300 ${getProgressColor()}`} 
            style={{ width: getProgressWidth() }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-white/80">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-3" />
          <span>0 - 7.9: Optimal execution zone</span>
        </div>
        <div className="flex items-center text-sm text-white/80">
          <div className="w-3 h-3 rounded-full bg-amber-500 mr-3" />
          <span>8.0 - 9.4: Warning zone. Push alerts dispatched.</span>
        </div>
        <div className="flex items-center text-sm text-white/80">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-3" />
          <span>9.5+: Critical zone. Imminent hard-throttle.</span>
        </div>
      </div>

      {ops >= 10 && (
        <div className="mt-6 bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm text-center font-medium animate-pulse">
          ⚠️ STRATEGY HARD PAUSED: 10 OPS LIMIT REACHED
        </div>
      )}
    </div>
  );
}
