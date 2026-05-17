"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, ChevronRight, Zap, 
  Shield, Globe, PlayCircle, ArrowUpRight, Sparkles 
} from 'lucide-react';

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);

  const stocks = [
    { name: 'NIFTY 50', price: '22,453.80', change: '+0.45%', up: true },
    { name: 'NASDAQ', price: '16,384.47', change: '+1.12%', up: true },
    { name: 'BTC/USD', price: '64,231.00', change: '-0.21%', up: false },
    { name: 'S&P 500', price: '5,222.68', change: '+0.11%', up: true },
    { name: 'ETH/USD', price: '3,450.12', change: '+2.45%', up: true },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans overflow-hidden relative">
      
      {/* Background Mesh Gradient (Engineering Marvel) */}
      <div className="absolute inset-0 overflow-hidden">
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
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-7xl">
        <div className="bg-[#0B0F19]/60 backdrop-blur-md border border-white/5 rounded-2xl px-6 py-4 flex justify-between items-center shadow-2xl">
          <div className="flex items-center gap-3">
            <img src="/logo_transparent.png" alt="Quantra Logo" className="h-9" />
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-white hover:text-glow transition-all">Marketplace</a>
            <a href="#" className="hover:text-white hover:text-glow transition-all">Backtest</a>
            <a href="#" className="hover:text-white hover:text-glow transition-all">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <a href="/auth" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Sign In</a>
            <a 
              href="/auth" 
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] transition-all active:scale-95 flex items-center gap-2"
            >
              Access Terminal <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </nav>

      {/* Ticker Bar (Integrated beautifully below nav) */}
      <div className="pt-28 bg-gradient-to-b from-[#030712] to-transparent">
        <div className="border-y border-white/5 bg-[#0B0F19]/30 backdrop-blur-sm py-3 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...stocks, ...stocks].map((stock, i) => (
              <div key={i} className="mx-12 flex items-center gap-3 text-xs font-bold tracking-wider">
                <span className="text-gray-500">{stock.name}</span>
                <span className="font-mono text-white">{stock.price}</span>
                <span className={stock.up ? 'text-emerald-400 text-glow' : 'text-red-400 text-glow'}>
                  {stock.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center relative">
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
          className="text-7xl md:text-8xl font-black text-white leading-[0.95] tracking-tighter mb-8"
        >
          Your Algorithm.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-500">Your Mantra.</span><br />
          Your Edge.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto text-gray-400 text-lg mb-12 font-medium leading-relaxed"
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
          <motion.button 
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-black text-lg hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2"
          >
            Build Your Edge 
            <motion.span animate={{ x: isHovered ? 5 : 0 }}>
              <ChevronRight className="h-5 w-5" />
            </motion.span>
          </motion.button>
          
          <button className="w-full sm:w-auto px-10 py-5 bg-transparent text-white border border-white/10 rounded-2xl font-black text-lg hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-3">
            <PlayCircle className="h-6 w-6 text-emerald-500" /> Watch Demo
          </button>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pb-32 relative">
        {[
          { icon: <Zap size={24} />, title: 'Zero Latency', desc: 'Direct market access infrastructure executing orders in microseconds.' },
          { icon: <Shield size={24} />, title: 'Institutional Security', desc: 'End-to-end encryption for your proprietary alpha strategies.' },
          { icon: <Globe size={24} />, title: 'Global Markets', desc: 'Seamlessly trade across 50+ major global exchanges from one view.' }
        ].map((f, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5, borderColor: 'rgba(16,185,129,0.3)' }}
            className="p-8 rounded-3xl bg-[#0B0F19]/40 backdrop-blur-sm border border-white/5 transition-all cursor-pointer group shadow-xl"
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
        ))}
      </section>

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
