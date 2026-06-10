"use client";

import React from 'react';
import { Shield, Check, Cpu, Zap, Globe, Flame } from 'lucide-react';
import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';

export default function PricingPage() {
  const tiers = [
    {
      name: 'Starter',
      price: '₹2,499',
      period: 'per month',
      description: 'Ideal for retail traders testing their first algorithms.',
      features: [
        'Up to 3 active strategy alerts',
        'End-of-day market scanning',
        'Basic strategy backtest reports',
        'NSE Equity data support',
        'Email customer support'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Pro',
      price: '₹5,999',
      period: 'per month',
      description: 'Built for active traders running production systems.',
      features: [
        'Unlimited active strategy executions',
        'Real-time scanning & screener alerts',
        'Premium high-frequency backtester',
        'Direct Broker API execution',
        'Priority chat and call support'
      ],
      cta: 'Access Pro Plan',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'tailored pricing',
      description: 'Institutional-grade access with co-located setups.',
      features: [
        'Dedicated trading terminal instances',
        'Direct DMA/FIX feed connectivity',
        'Custom model implementation support',
        'Under 10ms microsecond execution latency',
        'SLA guaranteed dedicated account manager'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] text-white font-sans">
      <PublicNavbar />

      {/* Hero */}
      <div className="bg-[#161B22] border-b border-[#30363D] relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#388BFD]/5 to-transparent z-0 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">Simple, Transparent Plans</h1>
          <p className="text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
            Select the plan that fits your trading scale. Upgrade, downgrade, or cancel anytime.
          </p>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier, idx) => (
          <div 
            key={idx}
            className={`bg-[#161B22]/80 backdrop-blur-xl border rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative transition-all ${tier.popular ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : 'border-[#30363D]'}`}
          >
            {tier.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <Flame size={12} fill="currentColor" /> MOST POPULAR
              </div>
            )}

            <div>
              <div className="text-xl font-bold text-white mb-2">{tier.name}</div>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">{tier.description}</p>
              
              <div className="flex items-baseline gap-2 mb-8 border-b border-[#30363D] pb-6">
                <span className="text-4xl font-black font-mono text-white">{tier.price}</span>
                <span className="text-sm text-gray-500 font-medium">{tier.period}</span>
              </div>

              <div className="space-y-4 mb-8">
                {tier.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex gap-3 items-start">
                    <Check size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-xs text-gray-300 leading-relaxed">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              className={`w-full py-4 rounded-xl text-xs font-bold transition-all shadow-md ${tier.popular ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] text-white hover:scale-[1.02]' : 'bg-[#21262D] border border-[#30363D] text-white hover:bg-[#30363D]'}`}
            >
              {tier.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

