"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface OTPProps {
  email?: string;
  phone?: string;
}

export default function OTPVerification({ email, phone }: OTPProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [resends, setResends] = useState(0);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(0, 1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join("");
    if (token.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let result;
      if (email) {
        result = await supabase.auth.verifyOtp({
          email,
          token,
          type: "email",
        });
      } else if (phone) {
        result = await supabase.auth.verifyOtp({
          phone,
          token,
          type: "sms",
        });
      }

      if (result?.error) throw result.error;

      // On success, redirect to onboarding wizard
      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resends >= 3) {
      setError("Maximum resend limit reached.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (email) {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email
        });
        if (error) throw error;
      } else if (phone) {
        const { error } = await supabase.auth.resend({
          type: 'sms',
          phone
        });
        if (error) throw error;
      }
      
      setTimeLeft(30);
      setResends(resends + 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium text-white">Enter Verification Code</h3>
        <p className="text-sm text-white/60">
          We've sent a 6-digit code to {email || phone}
        </p>
      </div>

      <div className="flex justify-between gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-14 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        ))}
      </div>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading || otp.join("").length !== 6}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify & Continue"}
      </button>

      <div className="text-center">
        {timeLeft > 0 ? (
          <p className="text-sm text-white/50">Resend code in {timeLeft}s</p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resends >= 3 || loading}
            className="text-sm text-primary hover:underline disabled:opacity-50 disabled:hover:no-underline"
          >
            Resend Code
          </button>
        )}
      </div>
    </form>
  );
}
