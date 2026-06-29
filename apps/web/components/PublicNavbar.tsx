"use client";

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function PublicNavbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-7xl">
      <div className="bg-[#0B0F19]/60 backdrop-blur-md border border-white/5 rounded-2xl px-6 py-4 flex justify-between items-center shadow-2xl">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-white flex items-center justify-center rounded-lg shadow-sm group-hover:scale-105 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">Quantra</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <Link href="/marketplace" className="hover:text-white hover:text-glow transition-all">Marketplace</Link>
          <Link href="/backtest" className="hover:text-white hover:text-glow transition-all">Backtest</Link>
          <Link href="/pricing" className="hover:text-white hover:text-glow transition-all">Pricing</Link>
        </div>

        <div className="flex items-center gap-5">
          <Link href="/auth?mode=signin" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Sign In</Link>
          <Link 
            href="/auth?mode=signup" 
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] transition-all active:scale-95 flex items-center gap-2"
          >
            Sign Up <ChevronRight size={16} />
          </Link>
        </div>
      </div>
      <style jsx>{`
        .text-glow {
          text-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }
        .hover\\:text-glow:hover {
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </nav>
  );
}
