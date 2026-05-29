"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) throw error;
      setStatus("sent");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === "sent") {
    return (
      <div className="text-center space-y-6 py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] mb-2 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-3xl font-extrabold text-white">Check Your Email</h3>
        <p className="text-[#A1A1AA] text-base font-medium leading-relaxed">
          We've sent a password reset link to <br />
          <span className="text-white font-semibold">{email}</span>. Click the link to update your password.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleReset} className="flex flex-col gap-6">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 bg-white flex items-center justify-center rounded-2xl mb-8 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h3 className="text-4xl font-extrabold text-white tracking-tight mb-3">Reset Password</h3>
        <p className="text-[#A1A1AA] text-base font-medium max-w-sm">
          Enter your email and we'll send a secure link to reset your account credentials.
        </p>
      </div>

      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email Address"
        className="w-full bg-[#0A0A0A] border border-[#27272A] hover:border-[#3F3F46] focus:border-white focus:ring-1 focus:ring-white rounded-xl px-5 py-4 text-white placeholder-[#52525B] outline-none transition-all font-medium text-base text-center"
        style={{ color: 'white' }}
      />

      {error && (
        <div className="px-5 py-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl flex items-center justify-center text-[#EF4444] text-sm font-semibold">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white hover:bg-[#E4E4E7] text-black font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 size={20} className="animate-spin" /> : "Send Reset Link"}
      </button>
    </form>
  );
}
