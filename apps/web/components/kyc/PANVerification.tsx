"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PANVerification() {
  const [pan, setPan] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"pending" | "verified" | "failed" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase())) {
      setError("Invalid PAN format");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // In a real app, this would call a Next.js API route that interacts with the NSDL API
      // e.g. await fetch('/api/kyc/verify-pan', { method: 'POST', body: JSON.stringify({ pan }) })
      // For this implementation, we'll simulate the backend call

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Simulate API delay
      await new Promise(res => setTimeout(res, 1500));

      // Simulate successful verification
      await supabase.from("users").update({
        kyc_status: "verified",
        // pan_number is stored encrypted in the backend
      }).eq("id", user.id);

      setStatus("verified");
    } catch (err: any) {
      setError(err.message || "Verification failed");
      setStatus("failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-xl border border-white/10 max-w-md w-full">
      <h2 className="text-xl font-bold text-white mb-2">PAN Verification</h2>
      <p className="text-sm text-white/60 mb-6">
        SEBI requires PAN verification to unlock live trading deployments.
      </p>

      {status === "verified" ? (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Your PAN has been successfully verified.
        </div>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white/80 block mb-1">PAN Number</label>
            <input
              type="text"
              required
              value={pan}
              onChange={(e) => setPan(e.target.value.toUpperCase())}
              placeholder="ABCDE1234F"
              maxLength={10}
              className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary uppercase"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {status === "failed" && (
            <p className="text-red-400 text-sm">
              Verification failed. Max 3 attempts per day.
            </p>
          )}

          <button
            type="submit"
            disabled={loading || pan.length !== 10}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? "Verifying with NSDL..." : "Verify PAN"}
          </button>
        </form>
      )}
    </div>
  );
}
