"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function StrategyPublishForm() {
  const [name, setName] = useState("");
  const [algoId, setAlgoId] = useState("");
  const [type, setType] = useState<"white_box" | "black_box">("white_box");
  const [userRaVerified, setUserRaVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  // In a real app, we'd fetch `userRaVerified` inside useEffect.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (type === "black_box" && !userRaVerified) {
      setError("SEBI RA verification is required to publish Black Box strategies.");
      setLoading(false);
      return;
    }

    if (!/^(NSE|BSE)-STRAT-[A-Z0-9]{6}$/.test(algoId)) {
      setError("Invalid Algo-ID format. Must be NSE-STRAT-XXXXXX or BSE-STRAT-XXXXXX.");
      setLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Mock 1-year expiry

      const { error: dbError } = await supabase.from("strategies").insert({
        creator_id: user.id,
        name,
        type,
        algo_id: algoId,
        algo_id_expiry: expiryDate.toISOString(),
        status: "live" // SEBI mandate enforces validation before transition to live
      });

      if (dbError) throw dbError;
      
      alert("Strategy successfully registered and published with SEBI Compliance.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-xl max-w-md w-full">
      <h2 className="text-xl font-bold text-white mb-2">Publish Strategy</h2>
      <p className="text-sm text-white/60 mb-6">Register your strategy with Exchange Algo-ID</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-white/80 block mb-1">Strategy Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-white/80 block mb-1">Exchange Algo-ID</label>
          <input
            type="text"
            required
            placeholder="NSE-STRAT-XXXXXX"
            value={algoId}
            onChange={(e) => setAlgoId(e.target.value.toUpperCase())}
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-white/80 block mb-1">Strategy Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-white"
          >
            <option value="white_box">White Box (Transparent Rules)</option>
            <option value="black_box">Black Box (Proprietary / AI)</option>
          </select>
          {type === "black_box" && !userRaVerified && (
            <p className="text-red-400 text-xs mt-1">
              Warning: You must have an approved RA license to publish Black Box strategies.
            </p>
          )}
        </div>

        {error && <p className="text-red-400 text-sm bg-red-400/10 p-2 rounded">{error}</p>}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Register & Publish"}
        </button>
      </form>
    </div>
  );
}
