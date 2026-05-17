"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const supabase = createClient();
      
      if (mode === 'signin') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) throw signInError;
        router.push('/dashboard');
        
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        
        if (signUpError) {
          if (signUpError.message.toLowerCase().includes('captcha')) {
             throw new Error('Captcha required. Please disable Captcha in Supabase Auth settings for local development.');
          }
          throw signUpError;
        }
        
        setSuccess('Check your email for the login link.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-4 font-sans selection:bg-[#fff]/20 relative overflow-hidden">
      
      {/* Super Subtle Background Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="flex flex-col items-center mb-12">
          {/* Replaced Image with a crisp SVG Icon to ensure it always renders */}
          <div className="w-16 h-16 bg-white flex items-center justify-center rounded-2xl mb-8 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          
          <h1 className="text-4xl text-center font-extrabold text-white tracking-tight mb-3">
            {mode === 'signin' ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-center text-[#A1A1AA] text-base font-medium">
            {mode === 'signin' 
              ? 'Enter your details to access the terminal.' 
              : 'Sign up to automate your trading strategies.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <AnimatePresence mode="popLayout">
            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <input
                  type="text"
                  required={mode === 'signup'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#27272A] hover:border-[#3F3F46] focus:border-white focus:ring-1 focus:ring-white rounded-xl px-5 py-4 text-white placeholder-[#52525B] outline-none transition-all font-medium text-base text-center"
                  placeholder="Full Name"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#27272A] hover:border-[#3F3F46] focus:border-white focus:ring-1 focus:ring-white rounded-xl px-5 py-4 text-white placeholder-[#52525B] outline-none transition-all font-medium text-base text-center"
            placeholder="Email Address"
            style={{ color: 'white' }}
          />

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#27272A] hover:border-[#3F3F46] focus:border-white focus:ring-1 focus:ring-white rounded-xl px-5 py-4 text-white placeholder-[#52525B] outline-none transition-all font-medium text-base text-center tracking-[0.2em]"
            placeholder="••••••••"
            style={{ color: 'white' }}
          />

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="px-5 py-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl flex items-center justify-center gap-3 text-[#EF4444]">
                <AlertCircle size={18} />
                <p className="text-sm font-semibold text-center leading-relaxed">{error}</p>
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="px-5 py-4 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-xl flex items-center justify-center text-[#22C55E]">
                <p className="text-sm font-semibold text-center leading-relaxed">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-white hover:bg-[#E4E4E7] text-black font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : (mode === 'signin' ? 'Sign In' : 'Continue')}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[#A1A1AA] text-sm font-medium">
            {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError(null);
                setSuccess(null);
              }}
              className="text-white hover:text-[#D4D4D8] hover:underline decoration-[#52525B] underline-offset-4 transition-all ml-1"
            >
              {mode === 'signin' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
        
      </motion.div>
    </div>
  );
}
