"use client";

import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Search, 
  BarChart2, 
  Zap, 
  History, 
  SlidersHorizontal, 
  LogOut,
  Settings,
  Globe,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import LiveTickerTape from '@/components/dashboard/LiveTickerTape';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#0D1117] text-white overflow-hidden font-sans">
      
      {/* Sidebar */}
      <div className="w-64 bg-[#161B22] border-r border-[#30363D] flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-[#30363D] flex items-center gap-3">
            <div className="w-8 h-8 bg-white flex items-center justify-center rounded-lg shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Quantra</span>
          </div>

          {/* Navigation */}
          <nav className="mt-6 flex-1 overflow-y-auto">
            <div className="px-6 text-xs font-semibold text-gray-500 mb-2">MAIN MENU</div>
            <Link href="/dashboard" className="flex items-center gap-3 px-6 py-3 bg-[#1F2937] text-[#58A6FF] font-medium border-l-4 border-[#388BFD]">
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Link href="/dashboard/scanner" className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:bg-[#1F2937] hover:text-white transition-colors">
              <Search size={18} />
              Stock Scanner
            </Link>
            <Link href="/dashboard/builder" className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:bg-[#1F2937] hover:text-white transition-colors">
              <SlidersHorizontal size={18} />
              Strategy Builder
            </Link>
            <Link href="/dashboard/charts" className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:bg-[#1F2937] hover:text-white transition-colors">
              <BarChart2 size={18} />
              Live Charts
            </Link>
            <Link href="/dashboard/autotrade" className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:bg-[#1F2937] hover:text-white transition-colors">
              <Zap size={18} />
              Auto Trade
            </Link>
            <Link href="/dashboard/backtesting" className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:bg-[#1F2937] hover:text-white transition-colors">
              <History size={18} />
              Backtesting
            </Link>
            <Link href="/dashboard/scans" className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:bg-[#1F2937] hover:text-white transition-colors">
              <SlidersHorizontal size={18} />
              Custom Scans
            </Link>
            
            <div className="mt-8 px-6 text-xs font-semibold text-gray-500 mb-2">SYSTEM</div>
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:bg-[#1F2937] hover:text-white transition-colors">
              <Settings size={18} />
              Settings
            </Link>
          
            <div className="mt-8 px-6 text-xs font-semibold text-gray-500 mb-2">COMMUNITY</div>
            <Link href="/dashboard/feed" className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:bg-[#1F2937] hover:text-white transition-colors">
              <Globe size={18} />
              Social Feed
            </Link>
            <Link href="/creator" className="flex items-center justify-between px-6 py-3 text-gray-400 hover:bg-[#1F2937] hover:text-white transition-colors group">
              <div className="flex items-center gap-3">
                <Activity size={18} />
                Creator Studio
              </div>
            </Link>
          </nav>
        </div>

        {/* User Profile - Linked to Settings Page */}
        <Link href="/dashboard/settings" className="p-4 border-t border-[#30363D] flex items-center justify-between bg-[#11161D] hover:bg-[#1C2128] transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#388BFD] rounded-full flex items-center justify-center font-bold text-white">
              SB
            </div>
            <div>
              <div className="text-sm font-bold text-white">Shekhar Biswal</div>
              <div className="text-xs text-gray-500">ssbiswal14@gmail.com</div>
            </div>
          </div>
          <div className="text-gray-500 hover:text-white">
            <LogOut size={18} />
          </div>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Ticker Bar */}
        <LiveTickerTape />

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 bg-[#0D1117]">
          {children}
        </div>
      </div>
    </div>
  );
}
