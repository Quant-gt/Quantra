"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isDisposable, setIsDisposable] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(false);

  useEffect(() => {
    if (!email) {
      setIsDisposable(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      if (!email.includes("@")) return;

      setIsValidating(true);
      try {
        const response = await fetch("/api/v1/auth/validate-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        const result = await response.json();
        if (result.success && !result.valid) {
          setIsDisposable(true);
          setShakeTrigger(prev => !prev);
        } else {
          setIsDisposable(false);
        }
      } catch (err) {
        console.error("Email validation error:", err);
      } finally {
        setIsValidating(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDisposable || isValidating) return;
    
    // Redirect to onboarding
    window.location.href = "/onboarding";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-[440px]">
        <div className="bg-white p-10 rounded-[24px] shadow-sm border border-slate-200">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-extrabold text-slate-900">Join Quantra Pro</h2>
            <p className="text-slate-500 text-sm mt-2">Start automating your edge today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
              <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition text-slate-900" placeholder="Alex Rivera" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
              <motion.div
                animate={shakeTrigger ? { x: [-8, 8, -8, 8, 0] } : {}}
                transition={{ duration: 0.35 }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 outline-none transition text-slate-900 ${
                    isDisposable
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50/10"
                      : "border-slate-200 focus:ring-emerald-500"
                  }`}
                  placeholder="alex@quantra.io"
                />
              </motion.div>
              {isDisposable && (
                <p className="text-[11px] text-red-500 font-bold mt-1.5 animate-in fade-in duration-300">
                  Registration restricted. Please provide a valid personal or corporate email address.
                </p>
              )}
            </div>

            {/* Phone with Country Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</label>
              <div className="relative flex">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pr-2 border-r border-slate-200 cursor-pointer hover:bg-slate-100 rounded-l-xl">
                  <img src="https://flagcdn.com/us.svg" className="w-5 h-3 mr-1" alt="USA" />
                  <span className="text-sm font-semibold text-slate-700">+1</span>
                </div>
                <input type="tel" className="w-full pl-20 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition text-slate-900" placeholder="(555) 000-0000" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
              <input type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition" placeholder="••••••••" />
            </div>

            <button
              type="submit"
              disabled={isDisposable || isValidating}
              className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-100 mt-2 disabled:opacity-50 disabled:hover:bg-emerald-500 cursor-pointer"
            >
              {isValidating ? "Validating Email..." : "Create Pro Account"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-sm text-slate-500">
            Already using Quantra? 
            <a href="/auth" className="text-slate-900 font-bold hover:text-emerald-600">Sign In</a>
          </div>
        </div>
      </div>
    </div>
  );
}
