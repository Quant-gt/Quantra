"use client";

import { useState } from "react";
import zxcvbn from "zxcvbn";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import OTPVerification from "./OTPVerification";

export default function EmailSignUp({ mode }: { mode: "signin" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOTP, setShowOTP] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  const passwordScore = zxcvbn(password).score; // 0-4

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "signup" && passwordScore < 2) {
      setError("Password is too weak. Add numbers and symbols.");
      setLoading(false);
      return;
    }

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        setShowOTP(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showOTP) {
    return <OTPVerification email={email} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "signup" && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">Full Name</label>
          <input
            type="text"
            required
            minLength={2}
            maxLength={60}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="John Doe"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/80">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white/80">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="••••••••"
        />
        {mode === "signup" && password.length > 0 && (
          <div className="flex gap-1 mt-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  i < passwordScore ? "bg-primary" : "bg-white/10"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-sm bg-red-400/10 p-2 rounded">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
      >
        {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
      </button>

      {mode === "signin" && (
        <div className="text-center mt-4">
          <button type="button" className="text-sm text-primary hover:underline">
            Forgot password?
          </button>
        </div>
      )}
    </form>
  );
}
