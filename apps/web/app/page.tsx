"use client";

import React from 'react';
import { BarChart3, ChevronRight, Zap, TrendingUp } from 'lucide-react';

const Ticker = () => {
  const stocks = [
    { name: 'NIFTY 50', price: '22,453.80', change: '+0.45%', up: true },
    { name: 'NASDAQ', price: '16,384.47', change: '+1.12%', up: true },
    { name: 'BTC/USD', price: '64,231.00', change: '-0.21%', up: false },
    { name: 'S&P 500', price: '5,222.68', change: '+0.11%', up: true },
    { name: 'ETH/USD', price: '3,450.12', change: '+2.45%', up: true },
  ];

  return (
    <div className="bg-slate-900 text-white py-2 overflow-hidden border-b border-slate-800">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...stocks, ...stocks].map((stock, i) => (
          <div key={i} className="mx-8 flex items-center gap-2 text-sm font-medium">
            <span className="text-slate-400">{stock.name}</span>
            <span>{stock.price}</span>
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
    <div className="max-w-7xl mx-auto px-6 flex justify-between h-16 items-center">
      <div className="flex items-center gap-2">
        <div className="bg-slate-900 p-1.5 rounded-lg">
          <BarChart3 className="h-6 w-6 text-emerald-400" />
        </div>
        <span className="text-xl font-extrabold text-slate-900 tracking-tighter">QUANTRA</span>
      </div>
      <div className="hidden md:flex space-x-8 items-center text-sm font-semibold text-slate-600">
        <a href="#" className="hover:text-emerald-600 transition">Marketplace</a>
        <a href="#" className="hover:text-emerald-600 transition">Backtest</a>
        <a href="#" className="hover:text-emerald-600 transition">Solutions</a>
        <div className="h-4 w-[1px] bg-slate-200"></div>
        <a href="/auth" className="hover:text-slate-900">Login</a>
        <a href="/auth" className="bg-emerald-500 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-600 transition shadow-lg shadow-emerald-100">
          Open Account
        </a>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <section className="relative pt-20 pb-32 bg-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mb-6">
          <TrendingUp className="h-3 w-3" />
          NEW: MULTI-ASSET BACKTESTING ENGINE 2.0
        </div>
        <h1 className="text-6xl font-extrabold text-slate-900 leading-[1.1] mb-8">
          The Infrastructure for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
            Systematic Trading.
          </span>
        </h1>
        <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-xl">
          Quantra provides low-latency execution and visual strategy building for serious traders. No code. No servers to manage. Just pure Alpha.
        </p>
        <div className="flex items-center gap-4">
          <button className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
            Build Your First Strategy <ChevronRight className="h-4 w-4" />
          </button>
          <button className="px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition">
            View Marketplace
          </button>
        </div>
      </div>
    </div>
    {/* Abstract UI Background Element */}
    <div className="absolute right-0 top-20 w-1/2 h-[500px] bg-slate-50 rounded-l-[40px] border-y border-l border-slate-200 hidden lg:block shadow-2xl opacity-50"></div>
  </section>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Ticker />
      <Hero />
    </div>
  );
}
