"use client";

import React, { useState } from 'react';
import { 
  BarChart3, ChevronRight, TrendingUp, Zap, 
  ShieldCheck, Globe, Menu, X, PlayCircle 
} from 'lucide-react';

const QuantraApp = () => {
  const [view, setView] = useState<'landing' | 'signup'>('landing'); // Toggle between 'landing' and 'signup'

  // --- COMPONENTS ---

  const Ticker = () => {
    const stocks = [
      { name: 'NIFTY 50', price: '22,453.80', change: '+0.45%', up: true },
      { name: 'NASDAQ', price: '16,384.47', change: '+1.12%', up: true },
      { name: 'BTC/USD', price: '64,231.00', change: '-0.21%', up: false },
      { name: 'S&P 500', price: '5,222.68', change: '+0.11%', up: true },
      { name: 'ETH/USD', price: '3,450.12', change: '+2.45%', up: true },
    ];

    return (
      <div className="bg-slate-900 text-white py-2.5 overflow-hidden border-b border-slate-800">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...stocks, ...stocks].map((stock, i) => (
            <div key={i} className="mx-10 flex items-center gap-3 text-xs font-bold tracking-widest">
              <span className="text-slate-400">{stock.name}</span>
              <span className="font-mono">{stock.price}</span>
              <span className={stock.up ? 'text-emerald-400' : 'text-red-400'}>
                {stock.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const Navbar = () => (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex justify-between h-20 items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
          <div className="bg-slate-900 p-1.5 rounded-lg">
            <BarChart3 className="h-6 w-6 text-emerald-400" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 tracking-tighter italic">QUANTRA</span>
        </div>
        <div className="hidden md:flex space-x-10 items-center text-sm font-bold text-slate-500 uppercase tracking-tight">
          <a href="#" className="hover:text-emerald-600 transition">Marketplace</a>
          <a href="#" className="hover:text-emerald-600 transition">Backtest</a>
          <a href="#" className="hover:text-emerald-600 transition">Pricing</a>
          <div className="h-4 w-[1px] bg-slate-200"></div>
          <button onClick={() => setView('signup')} className="text-slate-900 hover:text-emerald-600">Login</button>
          <button 
            onClick={() => setView('signup')}
            className="bg-emerald-500 text-white px-6 py-3 rounded-xl hover:bg-emerald-600 transition shadow-lg shadow-emerald-100 active:scale-95"
          >
            Start Trading
          </button>
        </div>
      </div>
    </nav>
  );

  const LandingPage = () => (
    <div className="animate-in fade-in duration-700">
      <Ticker />
      <section className="relative pt-24 pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black mb-8 tracking-widest uppercase">
              <TrendingUp className="h-3.5 w-3.5" />
              Institutional Grade Execution
            </div>
            <h1 className="text-7xl font-extrabold text-slate-900 leading-[0.95] mb-8 tracking-tighter">
              Your Algorithm.<br />
              <span className="text-emerald-500">Your Mantra.</span><br />
              Your Edge.
            </h1>
            <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-lg">
              Quantra is the terminal for serious systematic traders. Deploy complex strategies across global markets with zero-latency infrastructure.
            </p>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setView('signup')}
                className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-3 shadow-2xl shadow-slate-200"
              >
                Create Your Edge <ChevronRight className="h-5 w-5" />
              </button>
              <button className="flex items-center gap-3 font-bold text-slate-900 hover:text-emerald-600 transition group">
                <PlayCircle className="h-10 w-10 text-emerald-500 group-hover:scale-110 transition" /> 
                Watch Demo
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-slate-50 rounded-[60px] border border-slate-100 relative overflow-hidden shadow-inner">
               {/* Mock Dashboard UI Graphic */}
               <div className="absolute inset-10 border border-slate-200 bg-white rounded-3xl shadow-2xl p-6">
                  <div className="flex justify-between mb-8">
                    <div className="w-24 h-3 bg-slate-100 rounded"></div>
                    <div className="w-12 h-3 bg-emerald-100 rounded"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="w-full h-32 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-300 font-mono text-xs italic">Strategy Visualizer</div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-16 bg-emerald-50 rounded-xl border border-emerald-100"></div>
                      <div className="h-16 bg-slate-50 rounded-xl"></div>
                      <div className="h-16 bg-slate-50 rounded-xl"></div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const SignupPage = () => (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex flex-col justify-center py-12 px-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white p-12 rounded-[32px] shadow-sm border border-slate-200">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Access the Terminal</h2>
            <p className="text-slate-400 font-medium mt-2">Professional algorithmic trading starts here.</p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <button type="button" className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition">
                  <img src="https://www.svgrepo.com/show/355037/google.svg" className="h-4 w-4" alt="G" /> Google
               </button>
               <button type="button" className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition">
                  <img src="https://www.svgrepo.com/show/448234/linkedin.svg" className="h-4 w-4" alt="L" /> LinkedIn
               </button>
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-slate-300 text-xs font-bold uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
              <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition font-medium" placeholder="Alex Rivera" />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Mobile Number</label>
              <div className="relative flex">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pr-3 border-r border-slate-200 cursor-pointer hover:bg-slate-100 rounded-l-2xl transition">
                  <img src="https://flagcdn.com/in.svg" className="w-5 h-3.5 rounded-sm mr-2" alt="Country" />
                  <span className="text-sm font-bold text-slate-700">+91</span>
                </div>
                <input type="tel" className="w-full pl-24 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition font-medium" placeholder="98765 43210" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Create Password</label>
              <input type="password" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition" placeholder="••••••••" />
            </div>

            <button className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black text-lg hover:bg-emerald-600 transition shadow-xl shadow-emerald-100 mt-4 active:scale-95">
              Initialize Account
            </button>
          </form>

          <p className="mt-10 text-center text-sm font-bold text-slate-400">
            Already a Quantra Pro? 
            <button onClick={() => setView('signup')} className="ml-2 text-slate-900 hover:text-emerald-600 underline underline-offset-4 decoration-emerald-500">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-['Inter'] selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      {view === 'landing' ? <LandingPage /> : <SignupPage />}
    </div>
  );
};

export default QuantraApp;
