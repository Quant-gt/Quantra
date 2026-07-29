"use client";

import Link from 'next/link';
import { Logo } from './Logo';
import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function PublicNavbar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname?.startsWith(path);
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0B0F19]/80 backdrop-blur-md shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
            <Logo />
          </div>
          <span className="text-xl font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">SigmaSpire</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <Link href="/marketplace" className={`hover:text-white hover:text-glow transition-all ${isActive('/marketplace') ? 'text-[#10B981]' : ''}`}>Marketplace</Link>
          <Link href="/backtest" className={`hover:text-white hover:text-glow transition-all ${isActive('/backtest') ? 'text-[#10B981]' : ''}`}>Backtest</Link>
          <Link href="/blog" className={`hover:text-white hover:text-glow transition-all ${isActive('/blog') ? 'text-[#10B981]' : ''}`}>Blog</Link>
          <Link href="/daily-news" className={`hover:text-white hover:text-glow transition-all ${isActive('/daily-news') ? 'text-[#10B981]' : ''}`}>Daily News</Link>
          <Link href="/pricing" className={`hover:text-white hover:text-glow transition-all ${isActive('/pricing') ? 'text-[#10B981]' : ''}`}>Pricing</Link>
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
