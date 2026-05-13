"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TwoFactorSetup() {
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "setup" | "verified">("idle");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleSetup = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
      });

      if (error) throw error;

      setFactorId(data.id);
      setQrCode(data.totp.qr_code); // Supabase returns an SVG string
      setStatus("setup");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorId) return;

    setLoading(true);
    setError(null);
    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) throw challenge.error;

      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code: verifyCode,
      });

      if (verify.error) throw verify.error;

      setStatus("verified");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-xl border border-white/10 max-w-md w-full">
      <h2 className="text-xl font-bold text-white mb-2">Two-Factor Authentication</h2>
      <p className="text-sm text-white/60 mb-6">
        Secure your account with Google Authenticator or Authy.
      </p>

      {status === "idle" && (
        <button
          onClick={handleSetup}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
        >
          {loading ? "Initializing..." : "Enable 2FA"}
        </button>
      )}

      {status === "setup" && qrCode && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg flex justify-center" dangerouslySetInnerHTML={{ __html: qrCode }} />
          
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white/80 block mb-1">Enter Code from App</label>
              <input
                type="text"
                required
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary text-center text-lg tracking-widest"
              />
            </div>
            
            {error && <p className="text-red-400 text-sm">{error}</p>}
            
            <button
              type="submit"
              disabled={loading || verifyCode.length !== 6}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Enable"}
            </button>
          </form>
        </div>
      )}

      {status === "verified" && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          2FA is enabled on your account.
        </div>
      )}
    </div>
  );
}
