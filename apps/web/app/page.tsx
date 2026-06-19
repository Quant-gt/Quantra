"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Zap, 
  Shield, Globe, PlayCircle, ArrowUpRight, Sparkles, X, Activity, Play, CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';
import TradingViewTicker from '@/components/TradingViewTicker';

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [demoStep, setDemoStep] = useState(0);



  // Auto-play steps in the Watch Demo simulator when open
  useEffect(() => {
    if (!isDemoOpen) {
      setDemoStep(0);
      return;
    }
    const interval = setInterval(() => {
      setDemoStep(prev => (prev < 4 ? prev + 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, [isDemoOpen]);

  return (
    <div className="h-screen overflow-y-auto bg-[#030712] text-white font-sans relative">
      
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -z-10"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, -50, 0],
            y: [0, 100, 0]
          }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] -z-10"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, 50, 0]
          }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute top-[30%] left-[40%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[150px] -z-10"
        />
      </div>

      {/* Floating Navbar */}
      <PublicNavbar />

      {/* Ticker Bar */}
      <div className="pt-28 bg-gradient-to-b from-[#030712] to-transparent">
        <TradingViewTicker />
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black mb-8 tracking-widest uppercase shadow-xl"
        >
          <Sparkles className="h-3.5 w-3.5" />
          The Future of Systematic Trading
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight"
        >
          Your Algorithm.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-500">Your Mantra.</span><br />
          Your Edge.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
        >
          Quantra is a hyper-visual, zero-latency terminal designed for serious traders. 
          Deploy complex strategies across global markets with institutional-grade precision.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link href="/auth" className="w-full sm:w-auto">
            <motion.button 
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              className="w-full px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-black text-lg hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2"
            >
              Build Your Edge 
              <motion.span animate={{ x: isHovered ? 5 : 0 }}>
                <ChevronRight className="h-5 w-5" />
              </motion.span>
            </motion.button>
          </Link>
          
          <button 
            onClick={() => setIsDemoOpen(true)}
            className="w-full sm:w-auto px-10 py-5 bg-transparent text-white border border-white/10 rounded-2xl font-black text-lg hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-3"
          >
            <PlayCircle className="h-6 w-6 text-emerald-500" /> Watch Demo
          </button>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20 relative">
        {[
          { icon: <Zap size={24} />, title: 'Zero Latency', desc: 'Direct market access infrastructure executing orders in microseconds.' },
          { icon: <Shield size={24} />, title: 'Institutional Security', desc: 'End-to-end encryption for your proprietary alpha strategies.' },
          { icon: <Globe size={24} />, title: 'Global Markets', desc: 'Seamlessly trade across 500+ major global exchanges from one view.' }
        ].map((f, i) => (
          <Link href="/auth" key={i}>
            <motion.div 
              whileHover={{ y: -5, borderColor: 'rgba(16,185,129,0.3)' }}
              className="p-8 rounded-3xl bg-[#0B0F19]/40 backdrop-blur-sm border border-white/5 transition-all cursor-pointer group shadow-xl h-full"
            >
              <div className="text-emerald-500 mb-6 group-hover:scale-110 group-hover:text-glow transition-all duration-300">
                {f.icon}
              </div>
              <h3 className="text-white text-xl font-bold mb-3 group-hover:text-emerald-400 transition-colors">
                {f.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {f.desc}
              </p>
              <div className="mt-6 flex items-center text-xs font-bold text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                Learn More <ArrowUpRight size={12} className="ml-1" />
              </div>
            </motion.div>
          </Link>
        ))}
      </section>

      {/* Bottom Text Fills & CTA Section */}
      <section className="border-t border-white/5 bg-gradient-to-b from-[#0B0F19]/40 to-[#030712] py-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Ready to master the markets?</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed mb-10">
            Join thousands of quantitative traders and developers using Quantra to build, backtest, and deploy high-performance automated strategies.
          </p>
          <Link href="/auth">
            <button className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-black rounded-2xl text-lg hover:shadow-[0_0_45px_-5px_rgba(6,182,212,0.4)] transition-all">
              Get Started for Free
            </button>
          </Link>
        </div>
      </section>

      {/* Complete Footer Section */}
      <footer className="bg-[#030712] border-t border-white/5 py-16 px-6 text-gray-500 text-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Product</h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
              <Link href="/backtest" className="hover:text-white transition-colors">Strategy Backtesting</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing Plans</Link>
              <Link href="/dashboard/charts" className="hover:text-white transition-colors">Live Terminals</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Developers</h4>
            <div className="flex flex-col gap-2.5">
              <a href="/docs" className="hover:text-white transition-colors">API Docs</a>
              <a href="/status" className="hover:text-white transition-colors">System Status</a>
              <a href="/github" className="hover:text-white transition-colors">Github Repo</a>
              <a href="/docs" className="hover:text-white transition-colors">SDK Libraries</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Compliance</h4>
            <div className="flex flex-col gap-3 text-sm text-gray-500">
              <h4 className="font-bold text-white mb-2">Legal</h4>
              <a href="/risk-disclosure" className="hover:text-white transition-colors">Risk Disclosure</a>
              <a href="/sebi" className="hover:text-white transition-colors">SEBI Regulations</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Quantra</h4>
            <p className="text-gray-600 text-xs leading-relaxed">
              Institutional-grade systematic trading terminals for active market participants. SEBI registered RA integrations.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <span>&copy; {new Date().getFullYear()} Quantra Technologies Inc. All rights reserved.</span>
          <span>Designed for ultra-low latency execution.</span>
        </div>
      </footer>

      {/* Interactive Watch Demo Modal (Simulates Platform Experience) */}
      <AnimatePresence>
        {isDemoOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0B0F19] border border-white/10 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[520px]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#0D1117]">
                <div className="flex items-center gap-2">
                  <Activity className="text-emerald-500 animate-pulse" size={18} />
                  <span className="font-bold text-sm text-white">Quantra Live Terminal Simulator (Demo Tour)</span>
                </div>
                <button 
                  onClick={() => setIsDemoOpen(false)}
                  className="text-gray-500 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Simulation Player Workspace */}
              <div className="flex-1 grid grid-cols-3 bg-[#030712] divide-x divide-white/5 overflow-hidden">
                
                {/* Left Panel: Walkthrough Steps */}
                <div className="col-span-1 p-6 flex flex-col justify-between bg-[#0B0F19]/40">
                  <div className="space-y-4">
                    <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">Interactive Replay</div>
                    <h3 className="font-bold text-lg text-white leading-tight">See how Quantra executes</h3>
                    
                    <div className="space-y-3 pt-4">
                      {[
                        'Create Strategy Logic',
                        'Configure Backtester',
                        'Analyze Performance Metrics',
                        'Go Live & Auto-Trade'
                      ].map((step, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => setDemoStep(idx)}
                          className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer text-xs transition-all ${demoStep === idx ? 'bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${demoStep === idx ? 'bg-emerald-500 text-black' : 'bg-white/5 text-gray-500'}`}>
                            {idx + 1}
                          </div>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[10px] text-gray-600 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    Autoplaying steps dynamically
                  </div>
                </div>

                {/* Right Panel: Active Demo State Visualizer */}
                <div className="col-span-2 p-6 flex flex-col justify-between overflow-hidden relative">
                  
                  {/* Step 1: Design Strategy */}
                  {demoStep === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 h-full flex flex-col justify-center">
                      <div className="bg-[#161B22] border border-white/5 p-4 rounded-2xl font-mono text-xs text-gray-400 space-y-2">
                        <div className="text-emerald-500">// Define algorithmic trigger</div>
                        <div><span className="text-purple-400">if</span> (rsi &lt; <span className="text-amber-500">30</span>) &#123;</div>
                        <div className="pl-4 text-cyan-400">executeOrder(<span className="text-emerald-400">"BUY"</span>, qty = <span className="text-amber-500">100</span>);</div>
                        <div>&#125;</div>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Design rules-based trading systems visually or write code with built-in variables.
                      </p>
                    </motion.div>
                  )}

                  {/* Step 2: Backtest */}
                  {demoStep === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 h-full flex flex-col justify-center">
                      <div className="bg-[#161B22] border border-white/5 p-4 rounded-2xl space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-400">Backtesting NIFTY 50...</span>
                          <span className="text-emerald-400 font-bold">100% Done</span>
                        </div>
                        <div className="h-2 w-full bg-[#0D1117] rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[100%]"></div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Simulate strategy performance instantly over years of historical tick-level charts.
                      </p>
                    </motion.div>
                  )}

                  {/* Step 3: Performance */}
                  {demoStep === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 h-full flex flex-col justify-center">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#161B22] border border-white/5 p-3 rounded-xl text-center">
                          <div className="text-[9px] text-gray-500 uppercase font-bold">CAGR</div>
                          <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">28.4%</div>
                        </div>
                        <div className="bg-[#161B22] border border-white/5 p-3 rounded-xl text-center">
                          <div className="text-[9px] text-gray-500 uppercase font-bold">Max Drawdown</div>
                          <div className="text-base font-bold font-mono text-red-400 mt-0.5">-6.8%</div>
                        </div>
                        <div className="bg-[#161B22] border border-white/5 p-3 rounded-xl text-center">
                          <div className="text-[9px] text-gray-500 uppercase font-bold">Win Rate</div>
                          <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">71.2%</div>
                        </div>
                        <div className="bg-[#161B22] border border-white/5 p-3 rounded-xl text-center">
                          <div className="text-[9px] text-gray-500 uppercase font-bold">Sharpe Ratio</div>
                          <div className="text-base font-bold font-mono text-cyan-400 mt-0.5">2.41</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Review high-fidelity metric metrics ensuring strategy robustness before deploying.
                      </p>
                    </motion.div>
                  )}

                  {/* Step 4: Auto-trade Live */}
                  {demoStep === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 h-full flex flex-col justify-center">
                      <div className="bg-[#161B22]/80 border border-emerald-500/30 p-4 rounded-2xl flex items-center gap-4">
                        <CheckCircle className="text-emerald-400 shrink-0" size={32} />
                        <div>
                          <div className="font-bold text-white text-sm">Strategy Deployed Live</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">Watching live NSE ticker signals...</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Connect with one of our API broker partners to execute alerts and orders automatically.
                      </p>
                    </motion.div>
                  )}

                  {/* Visual controls footer */}
                  <div className="border-t border-white/5 pt-4 mt-auto flex justify-between items-center text-[10px] text-gray-500">
                    <span>Press the steps to navigate manually.</span>
                    <Link 
                      href="/auth"
                      className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-lg transition-colors inline-block"
                    >
                      Access Terminal
                    </Link>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CSS for Text Glow */}
      <style jsx>{`
        .text-glow {
          text-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }
        .hover\:text-glow:hover {
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}

