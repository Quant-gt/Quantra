"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Zap, 
  Shield, Globe, PlayCircle, ArrowUpRight, Sparkles, X, Activity, Play, CheckCircle,
  Lock, Plus, Search, Bookmark, ChevronDown, Download, HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';
import TradingViewTicker from '@/components/TradingViewTicker';
import { ClickToChartModal } from '@/components/workspace/click-to-chart-modal';

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [activeStrategyTab, setActiveStrategyTab] = useState<'value' | 'momentum' | 'volume'>('value');
  const [selectedDisclosure, setSelectedDisclosure] = useState<any | null>(null);
  const [disclosureFilter, setDisclosureFilter] = useState<'All' | 'Earnings' | 'Corporate Actions' | 'Bulk Deals'>('All');
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [activeTicker, setActiveTicker] = useState('RELIANCE');
  const [isSignupDrawerOpen, setIsSignupDrawerOpen] = useState(false);

  // Live aggregated datasets (Replacing mock data fallback arrays)
  const [liveDisclosures, setLiveDisclosures] = useState<any[]>([]);
  const [isDisclosuresLoading, setIsDisclosuresLoading] = useState(true);

  const [liveFiiDii, setLiveFiiDii] = useState<any[]>([]);
  const [isFiiDiiLoading, setIsFiiDiiLoading] = useState(true);

  const [liveStrategies, setLiveStrategies] = useState<Record<'value' | 'momentum' | 'volume', any[]>>({
    value: [],
    momentum: [],
    volume: []
  });
  const [isStrategiesLoading, setIsStrategiesLoading] = useState(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      // 1. Fetch live exchange disclosures
      try {
        const discRes = await fetch('/api/v1/market/disclosures');
        const discJson = await discRes.json();
        if (discJson.success && discJson.disclosures) {
          setLiveDisclosures(discJson.disclosures);
        }
      } catch (err) {
        console.error("Disclosures fetch failed:", err);
      } finally {
        setIsDisclosuresLoading(false);
      }

      // 2. Fetch Institutional FII / DII activity
      try {
        const fiiRes = await fetch('/api/v1/market/fii-dii');
        const fiiJson = await fiiRes.json();
        if (fiiJson.success && fiiJson.data) {
          setLiveFiiDii(fiiJson.data);
        }
      } catch (err) {
        console.error("FII / DII fetch failed:", err);
      } finally {
        setIsFiiDiiLoading(false);
      }

      // 3. Fetch strategy preview pricing metrics (Resolves real quotes via master token mapping symbols)
      try {
        const stratRes = await fetch('/api/v1/market/quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbols: ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'SBIN'] })
        });
        const stratJson = await stratRes.json();
        if (stratJson.quotes) {
          const names: Record<string, string> = {
            RELIANCE: 'Reliance Industries Ltd.',
            TCS: 'Tata Consultancy Services Ltd.',
            HDFCBANK: 'HDFC Bank Ltd.',
            INFY: 'Infosys Ltd.',
            SBIN: 'State Bank of India'
          };
          const symbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'SBIN'];

          setLiveStrategies({
            value: symbols.map(sym => {
              const live = stratJson.quotes[sym] || {};
              return {
                symbol: sym,
                name: names[sym] || sym,
                price: live.close || 0,
                change: live.change || 0,
                pe: live.pe ? `${live.pe.toFixed(1)}x` : '--'
              };
            }),
            momentum: symbols.map(sym => {
              const live = stratJson.quotes[sym] || {};
              return {
                symbol: sym,
                name: names[sym] || sym,
                price: live.close || 0,
                change: live.change || 0,
                rsi: live.rsi ? live.rsi.toFixed(1) : '--'
              };
            }),
            volume: symbols.map(sym => {
              const live = stratJson.quotes[sym] || {};
              return {
                symbol: sym,
                name: names[sym] || sym,
                price: live.close || 0,
                change: live.change || 0,
                volume: live.volume ? `${(live.volume / 1000000).toFixed(1)}M` : '--'
              };
            })
          });
        }
      } catch (err) {
        console.error("Strategy data fetch failed:", err);
      } finally {
        setIsStrategiesLoading(false);
      }
    };

    fetchLandingData();
  }, []);

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
          Best Hyper-Visual<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-500">Trading Terminal</span><br />
          for Indian Markets.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
        >
          SigmaSpire is a zero-latency, institutional-grade systematic trading platform designed for serious Indian retail and quant traders. Build, backtest, and automate your algorithmic trading edge directly on the NSE.
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
              Build Your Edge on SigmaSpire 
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


      {/* Layout Block A: Corporate Announcement Timeline & Market Pulse */}
      <section className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
        {/* Left Column: Institutional FII / DII Tracker */}
        <div className="bg-[#0B0F19]/40 border border-zinc-900 rounded-3xl p-6 backdrop-blur-sm">
          <h3 className="text-white text-xl font-bold mb-1 flex items-center gap-2">
            <Activity className="text-emerald-500 h-5 w-5" />
            Institutional FII / DII Tracker
          </h3>
          <p className="text-zinc-500 text-xs mb-6 leading-relaxed">Track live FII DII data and daily institutional volume flow on the NSE. SigmaSpire's proprietary trackers reveal gross purchases, sales, and net institutional market positioning for advanced quantitative analysis.</p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 font-bold uppercase tracking-wider pb-2">
                  <th className="pb-3 font-semibold">Participant Pool</th>
                  <th className="pb-3 text-right font-semibold">Gross Purchase</th>
                  <th className="pb-3 text-right font-semibold">Gross Sales</th>
                  <th className="pb-3 text-right font-semibold">Net Inflow/Outflow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/50">
                {isFiiDiiLoading ? (
                  [...Array(2)].map((_, idx) => (
                    <tr key={idx} className="animate-pulse bg-zinc-900/10">
                      <td className="py-3.5"><div className="h-4 bg-zinc-800 rounded w-44"></div></td>
                      <td className="py-3.5"><div className="h-4 bg-zinc-800 rounded w-16 ml-auto"></div></td>
                      <td className="py-3.5"><div className="h-4 bg-zinc-800 rounded w-16 ml-auto"></div></td>
                      <td className="py-3.5"><div className="h-4 bg-zinc-800 rounded w-16 ml-auto"></div></td>
                    </tr>
                  ))
                ) : (
                  liveFiiDii.map((item, idx) => (
                    <tr key={idx} className="hover:bg-zinc-900/35 transition-colors">
                      <td className="py-3.5 text-zinc-300 font-medium">{item.pool}</td>
                      <td className="py-3.5 text-right font-mono text-zinc-400">₹{item.buy.toLocaleString()} Cr</td>
                      <td className="py-3.5 text-right font-mono text-zinc-400">₹{item.sell.toLocaleString()} Cr</td>
                      <td className={`py-3.5 text-right font-mono font-bold ${item.net >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {item.net >= 0 ? '+' : ''}₹{item.net.toLocaleString()} Cr
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Systemic Disclosures Feed */}
        <div className="bg-[#0B0F19]/40 border border-zinc-900 rounded-3xl p-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                Systemic Disclosures
              </h3>
              <p className="text-zinc-500 text-xs mt-0.5 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Exchange Sync (Cached hourly)
              </p>
            </div>
            
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1 bg-zinc-900/60 p-0.5 rounded-lg border border-zinc-900">
              {(['All', 'Earnings', 'Corporate Actions', 'Bulk Deals'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setDisclosureFilter(filter)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                    disclosureFilter === filter
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
            {isDisclosuresLoading ? (
              [...Array(3)].map((_, idx) => (
                <div key={idx} className="animate-pulse flex items-start gap-4 p-3 rounded-2xl border border-zinc-900/60 bg-zinc-900/10">
                  <div className="shrink-0 min-w-[50px] space-y-2">
                    <div className="h-3.5 bg-zinc-800 rounded w-10 mx-auto"></div>
                    <div className="h-4 bg-zinc-800 rounded w-12 mx-auto"></div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-zinc-800 rounded w-20"></div>
                    <div className="h-3.5 bg-zinc-800 rounded w-full"></div>
                  </div>
                </div>
              ))
            ) : (
              liveDisclosures
                .filter(d => disclosureFilter === 'All' || d.type === disclosureFilter)
                .map((disclosure, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedDisclosure(disclosure)}
                    className="flex items-start gap-4 p-3 rounded-2xl border border-zinc-900/60 hover:bg-zinc-900/35 hover:border-zinc-800 transition-all cursor-pointer group"
                  >
                    <div className="flex flex-col items-center justify-center text-center shrink-0 min-w-[50px]">
                      <span className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors">{disclosure.time}</span>
                      <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded mt-1.5 uppercase font-bold group-hover:bg-zinc-850 group-hover:text-zinc-200 transition-colors">
                        {disclosure.exchange}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">{disclosure.ticker}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                          disclosure.type === 'Earnings' ? 'bg-purple-900/20 text-purple-400 border border-purple-800/20' :
                          disclosure.type === 'Dividend' ? 'bg-blue-900/20 text-blue-400 border border-blue-800/20' :
                          'bg-amber-900/20 text-amber-400 border border-amber-800/20'
                        }`}>
                          {disclosure.type}
                        </span>
                      </div>
                      <p className="text-zinc-500 text-xs line-clamp-1 group-hover:text-zinc-400 transition-colors leading-relaxed">
                        {disclosure.title}
                      </p>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </section>

      {/* Layout Block B: The Strategy Preview Data Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20 relative">
        <div className="bg-[#0B0F19]/40 border border-zinc-900 rounded-3xl p-6 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                Live Alpha Discovery Engines
              </h3>
              <p className="text-zinc-500 text-xs mt-0.5 leading-relaxed max-w-xl">Leverage SigmaSpire's structural momentum stock scanner and volume inflow shock scanner to identify live alpha on the NSE. Instantly filter assets by Value Core Low P/E Multiples or RSI overbought conditions.</p>
            </div>

            {/* Strategy Selectors */}
            <div className="flex bg-zinc-900/60 p-0.5 rounded-xl border border-zinc-900">
              <button
                onClick={() => setActiveStrategyTab('value')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeStrategyTab === 'value'
                    ? 'bg-emerald-500 text-gray-950 shadow-lg shadow-emerald-500/10 font-bold'
                    : 'text-zinc-500 hover:text-zinc-300 font-bold'
                }`}
              >
                Value Core (Low P/E Multiples)
              </button>
              <button
                onClick={() => setActiveStrategyTab('momentum')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeStrategyTab === 'momentum'
                    ? 'bg-zinc-800 text-white shadow-sm font-bold'
                    : 'text-zinc-500 hover:text-zinc-300 font-bold'
                }`}
              >
                Structural Momentum (RSI Overbought)
              </button>
              <button
                onClick={() => setActiveStrategyTab('volume')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeStrategyTab === 'volume'
                    ? 'bg-zinc-800 text-white shadow-sm font-bold'
                    : 'text-zinc-500 hover:text-zinc-300 font-bold'
                }`}
              >
                Volume Inflow Shock
              </button>
            </div>
          </div>

          {/* Data Matrix Table */}
          <div className="overflow-x-auto border border-zinc-900/60 rounded-2xl bg-zinc-950/20">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 font-bold uppercase tracking-wider">
                  <th className="p-4 font-semibold">Asset Ticker</th>
                  <th className="p-4 text-right font-semibold">Last Traded Price</th>
                  <th className="p-4 text-right font-semibold">1D Price Action</th>
                  <th className="p-4 text-right font-semibold">
                    {activeStrategyTab === 'value' ? 'Current P/E' : activeStrategyTab === 'momentum' ? 'RSI (14)' : 'Volume (20D)'}
                  </th>
                  <th className="p-4 text-right font-semibold">Diagnostic Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/50">
                {isStrategiesLoading ? (
                  [...Array(5)].map((_, idx) => (
                    <tr key={idx} className="animate-pulse bg-zinc-900/10">
                      <td className="p-4"><div className="h-4 bg-zinc-800 rounded w-24"></div></td>
                      <td className="p-4"><div className="h-4 bg-zinc-800 rounded w-16 ml-auto"></div></td>
                      <td className="p-4"><div className="h-4 bg-zinc-800 rounded w-12 ml-auto"></div></td>
                      <td className="p-4"><div className="h-4 bg-zinc-800 rounded w-10 ml-auto"></div></td>
                      <td className="p-4"><div className="h-4 bg-zinc-800 rounded w-24 ml-auto"></div></td>
                    </tr>
                  ))
                ) : (
                  liveStrategies[activeStrategyTab]?.map((row, idx) => (
                    <tr
                      key={idx}
                      onClick={() => {
                        setActiveTicker(row.symbol);
                        setIsChartOpen(true);
                      }}
                      className="hover:bg-zinc-900/35 transition-colors cursor-pointer group"
                    >
                      <td className="p-4 font-medium text-white flex items-center gap-2">
                        <span className="group-hover:text-emerald-400 transition-colors font-bold">{row.symbol}</span>
                        <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400 transition-colors hidden sm:inline-block font-normal">({row.name})</span>
                        <Activity className="h-3 w-3 text-emerald-500/40 group-hover:text-emerald-400 shrink-0 transition-all duration-300 group-hover:scale-110" />
                      </td>
                      <td className="p-4 text-right font-mono text-zinc-300">₹{row.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className={`p-4 text-right font-mono font-bold ${row.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {row.change >= 0 ? '+' : ''}{row.change.toFixed(2)}%
                      </td>
                      <td className="p-4 text-right font-mono text-zinc-300">
                        {row.pe || row.rsi || row.volume || '--'}
                      </td>
                      <td className="p-4 text-right font-bold text-emerald-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all inline-flex items-center gap-1">
                        Examine Canvas <ArrowUpRight size={13} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Trigger conversion gate */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t border-zinc-900 pt-6 gap-4">
            <span className="text-xs text-zinc-500 leading-normal">
              Customize these filters or link live order brokers to execute signals automatically.
            </span>
            <button
              onClick={() => setIsSignupDrawerOpen(true)}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white text-zinc-300 px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Customize Strategy Rules <Lock size={12} className="text-zinc-500" />
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Text Fills & CTA Section */}
      <section className="border-t border-white/5 bg-gradient-to-b from-[#0B0F19]/40 to-[#030712] py-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Ready to master the markets?</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed mb-10">
            Join thousands of quantitative traders and developers using SigmaSpire to build, backtest, and deploy high-performance automated strategies.
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
              <Link href="/blog" className="hover:text-white transition-colors">Blog Articles</Link>
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
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">SigmaSpire</h4>
            <p className="text-gray-600 text-xs leading-relaxed pr-4">
              SigmaSpire provides institutional direct market access infrastructure and zero-latency execution APIs for the active quant trader in India. Integrate your automated strategy development Python SDK and utilize our SEBI registered RA automated trading integrations. Explore our API Docs for ultra-fast algorithmic backtesting and live deployment.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <span>&copy; {new Date().getFullYear()} SigmaSpire Technologies Inc. All rights reserved.</span>
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
                  <span className="font-bold text-sm text-white">SigmaSpire Live Terminal Simulator (Demo Tour)</span>
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
                    <h3 className="font-bold text-lg text-white leading-tight">See how SigmaSpire executes</h3>
                    
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

      {/* Click-To-Chart Modal */}
      <ClickToChartModal
        isOpen={isChartOpen}
        onClose={() => setIsChartOpen(false)}
        ticker={activeTicker}
        exchange="NSE"
      />

      {/* Slide-over Registration Drawer */}
      <AnimatePresence>
        {isSignupDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSignupDrawerOpen(false)}
              className="absolute inset-0 bg-black"
            />
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-[#0D0D11] border-l border-zinc-800 p-8 flex flex-col justify-between h-full shadow-2xl z-10 text-zinc-100"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Zap className="text-emerald-400" size={18} />
                    Unlock Unlimited Access
                  </h3>
                  <button
                    onClick={() => setIsSignupDrawerOpen(false)}
                    className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-zinc-900 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    You are accessing guest features. Join SigmaSpire Pro to save custom filters, run historical backtests, and link your broker keys.
                  </p>
                  
                  <div className="space-y-4 pt-2">
                    <div className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-white">Save Custom Trading Rules</h4>
                        <p className="text-[10px] text-gray-500">Persist custom screening sentences directly in your personal workspace.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-white">Historical Backtest Engines</h4>
                        <p className="text-[10px] text-gray-500">Run 5-year tick-level performance scans relative to past time snapshots.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-white">1-Click Live Deployments</h4>
                        <p className="text-[10px] text-gray-500">Connect modern API broker terminals for fully automated execution.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    window.location.href = '/auth/signup?source=funnel';
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-xl font-bold hover:opacity-90 transition shadow-lg text-xs cursor-pointer"
                >
                  Create Pro Account
                </button>
                <button
                  onClick={() => {
                    window.location.href = '/auth';
                  }}
                  className="w-full py-3.5 bg-zinc-900 border border-zinc-800 text-gray-300 rounded-xl font-bold hover:text-white transition text-xs cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Slide-over Disclosure Document Sheet */}
      <AnimatePresence>
        {selectedDisclosure && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDisclosure(null)}
              className="absolute inset-0 bg-black"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-[#0D0D11] border-l border-zinc-800 p-8 flex flex-col justify-between h-full shadow-2xl z-10 text-zinc-100"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-[#21262D] text-[#58A6FF] px-2 py-0.5 rounded uppercase font-bold">{selectedDisclosure.exchange}</span>
                    <span className="text-[10px] bg-purple-950/40 text-purple-400 border border-purple-800/40 px-2 py-0.5 rounded-full font-bold uppercase">{selectedDisclosure.type}</span>
                  </div>
                  <button
                    onClick={() => setSelectedDisclosure(null)}
                    className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-zinc-900 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] text-gray-500 font-bold block font-mono">FILED AT {selectedDisclosure.time} IST</span>
                  <h2 className="text-xl font-bold text-white leading-snug">{selectedDisclosure.title}</h2>
                  <p className="text-xs text-gray-400 leading-relaxed pt-2">
                    {selectedDisclosure.content}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDisclosure(null)}
                className="w-full py-3.5 bg-zinc-900 border border-zinc-800 text-gray-300 rounded-xl font-bold hover:text-white transition text-xs cursor-pointer"
              >
                Close Document
              </button>
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

