"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import OTPVerification from "./OTPVerification";

export default function MobileSignUp({ mode }: { mode: "signin" | "signup" }) {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOTP, setShowOTP] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate 10-digit Indian mobile number
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Please enter a valid 10-digit Indian mobile number");
      setLoading(false);
      return;
    }

    try {
      const phone = `+91${mobile}`;
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });
      if (error) throw error;
      setShowOTP(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showOTP) {
    return <OTPVerification phone={`+91${mobile}`} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/80">Mobile Number</label>
        <div className="flex bg-white/5 border border-white/10 rounded-md focus-within:ring-2 focus-within:ring-primary overflow-hidden">
          <span className="flex items-center px-3 text-white/50 border-r border-white/10 bg-black/20">
            +91
          </span>
          <input
            type="tel"
            required
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
            className="w-full bg-transparent px-3 py-2 text-white placeholder-white/30 focus:outline-none"
            placeholder="9876543210"
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm bg-red-400/10 p-2 rounded">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
    </form>
  );
}
