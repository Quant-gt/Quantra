"use client";

import React, { useState } from 'react';
import { Check, Flame, Zap, Shield, Code, Briefcase, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';
import RazorpayButton from '@/components/checkout/RazorpayButton';
import { createClient } from '@supabase/supabase-js'; // Placeholder for auth check

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<'buyers' | 'creators'>('buyers');
  // In a real app, you'd fetch the user ID from auth context. Using a mock UUID for demo.
  const mockUserId = "00000000-0000-0000-0000-000000000001";

  const buyerTiers = [
    {
      id: 'tier_1_buyer',
      name: 'The Sandbox Pass',
      price: '₹0',
      period: 'Free Forever',
      target: 'Casual retail traders, students, and curious learners.',
      features: [
        'Full access to the visual terminal interface & charting dashboards.',
        'Unlimited virtual Paper Trading (simulated live order flows).',
        'Core data indicators (RSI, MACD) with 1 year of historical backtesting.'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      id: 'tier_2_buyer',
      name: 'The Live Execution Pass',
      price: '₹499',
      period: 'per month',
      target: 'Retail traders deploying 1–2 automated strategies.',
      features: [
        'Connect a single active live broker account (Zerodha, Fyers, AngelOne).',
        'Execute up to 2 concurrent live strategy scripts concurrently.',
        'Access to purchase basic strategies off the /marketplace.'
      ],
      cta: 'Access Live Execution',
      popular: false
    },
    {
      id: 'tier_3_buyer',
      name: 'The Quant Pro Pass',
      price: '₹1,499',
      period: 'per month',
      target: 'Heavy derivatives/Options scalpers and multi-strategy traders.',
      features: [
        'Connect up to 3 independent broker accounts simultaneously.',
        'Run up to 10 concurrent live algorithms concurrently.',
        'Unlocks Priority Low-Latency Channels (orders bypass standard queues).',
        'Full tick-by-tick 5-year deep historical backtesting capability.'
      ],
      cta: 'Upgrade to Pro',
      popular: true
    },
    {
      id: 'tier_4_buyer',
      name: 'The Alpha Terminal Elite',
      price: '₹3,999',
      period: 'per month',
      target: 'Professional quants, family offices, and high-frequency traders.',
      features: [
        'Unlimited broker API accounts and unlimited concurrent strategy execution.',
        'Direct access to custom webhooks (trigger trades directly via TradingView).',
        'Dedicated ultra-low latency compute node access.',
        '1-on-1 developer onboarding and custom terminal configurations.'
      ],
      cta: 'Get Alpha Elite',
      popular: false
    }
  ];

  const creatorTiers = [
    {
      id: 'tier_1_creator',
      name: 'The Private Dev Sandbox',
      price: '₹0',
      period: 'Free Forever',
      target: 'Math students, private quants, and strategy hobbyists.',
      features: [
        'Unlimited access to the code/no-code strategy builder workspace.',
        'Run private backtests and private paper trading loops.',
        'Restriction: Zero public listings allowed on the /marketplace.'
      ],
      cta: 'Start Building Free',
      popular: false
    },
    {
      id: 'tier_2_creator',
      name: 'The Rising Vendor Pass',
      price: '₹999',
      period: 'per month',
      target: 'Part-time strategy creators testing commercial interest.',
      features: [
        'List up to 2 active strategies publicly on the SigmaSpire Marketplace.',
        'Unlocks basic subscriber tracking analytics and payout panel.',
        'Standard platform convenience split at checkout (90/10).'
      ],
      cta: 'Become a Vendor',
      popular: true
    },
    {
      id: 'tier_3_creator',
      name: 'The Institutional Studio',
      price: '₹2,499',
      period: 'per month',
      target: 'Professional quants, financial content creators, and expert developers.',
      features: [
        'List up to 10 active strategies publicly on the marketplace.',
        'Secure, encrypted script compilation (source code obfuscation).',
        'Advanced analytics tracking user performance and churn loops.'
      ],
      cta: 'Open Studio',
      popular: false
    },
    {
      id: 'tier_4_creator',
      name: 'The SEBI Compliance Partner',
      price: '₹4,999',
      period: 'per month (First 3 Mos Free)',
      target: 'Verified SEBI-registered Research Analysts (RAs) or Investment Advisers.',
      features: [
        'Unlimited strategy listings on the public marketplace.',
        'Verified "SEBI Registered" trust-badge displayed prominently.',
        'Lower platform fee deductions and dedicated API support.'
      ],
      cta: 'Apply for Partnership',
      popular: false
    }
  ];

  const activeData = activeTab === 'buyers' ? buyerTiers : creatorTiers;

  return (
    <div className="min-h-screen bg-[#0D1117] text-white font-sans">
      <PublicNavbar />

      {/* Hero & Toggle */}
      <div className="bg-[#161B22] border-b border-[#30363D] relative pt-32 pb-16 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#388BFD]/5 to-transparent z-0 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
            Institutional Infrastructure.<br /> Retail Pricing.
          </h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Deploy advanced quantitative models without the overhead. Select the SaaS tier that fits your scale.
          </p>

          <div className="inline-flex bg-[#0D1117] p-1 rounded-xl border border-[#30363D] shadow-inner mb-6">
            <button
              onClick={() => setActiveTab('buyers')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'buyers' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-400 hover:text-white hover:bg-[#161B22]'
              }`}
            >
              <TrendingUp size={16} /> For Traders & Buyers
            </button>
            <button
              onClick={() => setActiveTab('creators')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'creators' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-gray-400 hover:text-white hover:bg-[#161B22]'
              }`}
            >
              <Code size={16} /> For Strategy Creators
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {activeData.map((tier) => {
          const isFree = tier.price === '₹0';
          const buttonClass = tier.popular
            ? 'w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-bold rounded-lg shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)] transition-all transform hover:scale-[1.02]'
            : 'w-full py-3 px-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-100 font-bold rounded-lg shadow-sm transition-all transform hover:scale-[1.02]';

          return (
            <div 
              key={tier.id}
              className={`bg-[#161B22]/80 backdrop-blur-md border rounded-2xl p-6 flex flex-col shadow-xl relative transition-all ${
                tier.popular ? 'border-blue-500/50 ring-1 ring-blue-500/20' : 'border-[#30363D]'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Flame size={12} fill="currentColor" /> MOST POPULAR
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                <p className="text-xs text-blue-400 font-medium mb-4">{tier.target}</p>
                
                <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-[#30363D]">
                  <span className="text-4xl font-black font-mono tracking-tight">{tier.price}</span>
                  <span className="text-xs text-gray-500 font-medium">{tier.period}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex gap-3 items-start">
                      <Check size={16} className="text-blue-500 mt-0.5 shrink-0" />
                      <span className="text-xs text-gray-300 leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-4 border-t border-[#30363D]/50">
                {isFree ? (
                  <Link href="/auth?mode=signup" className={`${buttonClass} block text-center`}>{tier.cta}</Link>
                ) : (
                  <RazorpayButton 
                    type="subscription"
                    planTierId={tier.id}
                    userId={mockUserId}
                    buttonText={tier.cta}
                    className={buttonClass}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* SaaS Disclaimer */}
      <div className="max-w-4xl mx-auto px-6 pb-20 text-center">
        <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-[#161B22] px-4 py-2 rounded-lg border border-[#30363D]">
          <Shield size={14} className="text-gray-400" />
          SigmaSpire operates exclusively as a Software-as-a-Service (SaaS) and code licensing marketplace. We do not pool or manage client funds.
        </div>
      </div>
    </div>
  );
}
