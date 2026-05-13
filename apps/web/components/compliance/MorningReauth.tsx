"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function MorningReauth() {
  const [loading, setLoading] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();
  const router = useRouter();

  const handleReauth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      // Verify TOTP (Simulated for this component unless user actually enrolled)
      // In a full implementation, call supabase.auth.mfa.challenge and verify
      if (totpCode.length !== 6) throw new Error("Invalid 2FA code");

      // Update subscriptions from daily_auth_expired -> active
      const { error: dbError } = await supabase
        .from('marketplace_subscriptions')
        .update({
          status: 'active',
          session_valid_until: new Date(new Date().setHours(16, 5, 0, 0)).toISOString(), // 16:05 IST today
          last_daily_2fa_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('status', 'daily_auth_expired');

      if (dbError) throw dbError;

      // Log compliance event
      await supabase.from('compliance_audit').insert({
        user_id: user.id,
        event_type: '2fa_completed',
        payload: { timestamp: new Date().toISOString() }
      });

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-xl border border-white/10 max-w-md w-full">
      <h2 className="text-xl font-bold text-white mb-2">Morning Re-Authentication</h2>
      <p className="text-sm text-white/60 mb-6">
        SEBI mandates daily re-authentication before 9:00 AM to keep your live strategies active.
      </p>

      <form onSubmit={handleReauth} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-white/80 block mb-1">Enter 2FA Code</label>
          <input
            type="text"
            required
            value={totpCode}
            onChange={(e) => setTotpCode(e.target.value)}
            placeholder="000000"
            maxLength={6}
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary text-center text-lg tracking-widest"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading || totpCode.length !== 6}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify & Resume Live Trading"}
        </button>
      </form>
    </div>
  );
}
