"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayCircle, ArrowUpRight, Zap, Code2, Lock, Shield,
  BarChart3, BrainCircuit, Users, X
} from 'lucide-react';
import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';
import TradingViewTicker from '@/components/TradingViewTicker';

export default function Home() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0D1117] text-white font-sans selection:bg-[#388BFD]/30 selection:text-white">
      {/* Ticker Tape */}
      <TradingViewTicker />

      {/* Navigation */}
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#388BFD]/20 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161B22] border border-[#30363D] mb-8 text-sm font-medium text-gray-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#39D353] animate-pulse" />
            Institutional Scale. Zero Code.
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
            Quant Trading. <br className="hidden md:block" />
            Redefined.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Build, backtest, and deploy algorithmic trading strategies on live markets. Access premium strategies or sell your own alpha.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/auth/signup"
              className="w-full sm:w-auto px-8 py-4 bg-[#2ea043] hover:bg-[#238636] text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(46,160,67,0.3)] flex items-center justify-center gap-2 group"
            >
              Get Started For Free
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            
            <button 
              onClick={() => setIsDemoOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] hover:border-[#8B949E] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group"
            >
              <PlayCircle className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              Watch Platform Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* Dual Ecosystem Section */}
      <section className="py-24 bg-[#0B0F19] border-y border-[#30363D]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">One Platform. Two Ecosystems.</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">SigmaSpire unites investors looking for edge and quants looking for scale.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Investor Box */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-3xl p-8 lg:p-12 shadow-xl relative overflow-hidden group hover:border-[#388BFD] transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#388BFD]/5 rounded-full blur-[80px] group-hover:bg-[#388BFD]/10 transition-colors" />
              <div className="w-14 h-14 bg-[#1C2128] border border-[#30363D] rounded-2xl flex items-center justify-center mb-8">
                <BarChart3 className="w-7 h-7 text-[#58A6FF]" />
              </div>
              <h3 className="text-2xl font-bold mb-4">For Investors</h3>
              <p className="text-gray-400 leading-relaxed mb-8">
                Rent Vetted Alpha. Connect your favorite broker, browse historical track records, and activate live trading with automatic risk guardrails.
              </p>
              <ul className="space-y-4">
                {[
                  "1-Click Broker Integration",
                  "Verified Strategy Performance",
                  "Automated Risk Management",
                  "Live Portfolio Tracking"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-300">
                    <Shield className="w-5 h-5 text-[#39D353]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Creator Box */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-3xl p-8 lg:p-12 shadow-xl relative overflow-hidden group hover:border-[#A371F7] transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#A371F7]/5 rounded-full blur-[80px] group-hover:bg-[#A371F7]/10 transition-colors" />
              <div className="w-14 h-14 bg-[#1C2128] border border-[#30363D] rounded-2xl flex items-center justify-center mb-8">
                <BrainCircuit className="w-7 h-7 text-[#D2A8FF]" />
              </div>
              <h3 className="text-2xl font-bold mb-4">For Quants</h3>
              <p className="text-gray-400 leading-relaxed mb-8">
                Build & Monetize. Turn code or visual blocks into production-grade systems. Lock down your source code and collect monthly recurring revenue.
              </p>
              <ul className="space-y-4">
                {[
                  "Visual Strategy Canvas",
                  "AI-Powered Logic Generation",
                  "Backtesting Engine",
                  "Marketplace Monetization"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-300">
                    <Code2 className="w-5 h-5 text-[#D2A8FF]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Gated Marketplace Teaser Section */}
      <section className="py-32 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">The SigmaSpire Marketplace</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Discover high-yield, institutional-grade algorithms engineered by top quants.</p>
        </div>

        {/* Gated Container */}
        <div className="relative overflow-hidden rounded-2xl border border-[#30363D] bg-[#0D1117] min-h-[500px]">
          
          {/* Mock Grid (Blurred) */}
          <div className="absolute inset-0 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-45 pointer-events-none select-none" style={{ filter: 'blur(6px) grayscale(40%)' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 h-[220px] flex flex-col justify-between">
                <div>
                  <div className="h-5 w-32 bg-gray-700 rounded mb-3" />
                  <div className="h-3 w-48 bg-gray-800 rounded mb-6" />
                  <div className="flex justify-between">
                    <div className="h-8 w-16 bg-emerald-900/50 rounded" />
                    <div className="h-8 w-16 bg-gray-800 rounded" />
                  </div>
                </div>
                <div className="h-10 w-full bg-gray-800 rounded" />
              </div>
            ))}
          </div>

          {/* The Gate Overlay Card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-md px-4">
            <div className="bg-[#0F172A]/95 backdrop-blur-md border border-[#10B981] rounded-2xl p-8 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.5)] text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
                <Lock className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Unlock the Marketplace</h3>
              <p className="text-gray-300 text-sm mb-8 leading-relaxed">
                Browse 500+ institutional-grade algorithmic strategies vetted by historical performance metrics.
              </p>
              
              <Link 
                href="/auth/signup"
                className="w-full py-3.5 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-xl transition-all shadow-lg mb-4 flex justify-center items-center"
              >
                Create Your Account Now
              </Link>
              
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-white hover:text-[#10B981] transition-colors underline underline-offset-4">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      <AnimatePresence>
        {isDemoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsDemoOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl border border-[#30363D] shadow-2xl overflow-hidden flex items-center justify-center"
            >
              <button 
                onClick={() => setIsDemoOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex flex-col items-center gap-4 text-gray-500">
                <PlayCircle size={48} className="opacity-50" />
                <p>Platform Demo Video Placeholder</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
