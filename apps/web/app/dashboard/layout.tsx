"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  BarChart2, 
  Zap, 
  History, 
  SlidersHorizontal, 
  LogOut 
} from 'lucide-react';

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
          <div className="p-6 flex items-center gap-2 border-b border-[#30363D]">
            <BarChart2 className="text-[#388BFD]" size={24} />
            <span className="text-xl font-bold text-white">Quantra</span>
          </div>

          {/* Navigation */}
          <nav className="mt-6">
            <div className="px-6 text-xs font-semibold text-gray-500 mb-2">MAIN MENU</div>
            <a href="/dashboard" className="flex items-center gap-3 px-6 py-3 bg-[#1F2937] text-[#58A6FF] font-medium border-l-4 border-[#388BFD]">
              <LayoutDashboard size={18} />
              Dashboard
            </a>
            <a href="/dashboard/scanner" className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:bg-[#1F2937] hover:text-white transition-colors">
              <Search size={18} />
              Stock Scanner
            </a>
            <a href="/dashboard/charts" className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:bg-[#1F2937] hover:text-white transition-colors">
              <BarChart2 size={18} />
              Live Charts
            </a>
            <a href="/dashboard/autotrade" className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:bg-[#1F2937] hover:text-white transition-colors">
              <Zap size={18} />
              Auto Trade
            </a>
            <a href="/dashboard/backtesting" className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:bg-[#1F2937] hover:text-white transition-colors">
              <History size={18} />
              Backtesting
            </a>
            <a href="/dashboard/scans" className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:bg-[#1F2937] hover:text-white transition-colors">
              <SlidersHorizontal size={18} />
              Custom Scans
            </a>
          </nav>
        </div>

        {/* User Profile - Linked to Profile Page */}
        <a href="/dashboard/profile" className="p-4 border-t border-[#30363D] flex items-center justify-between bg-[#11161D] hover:bg-[#1C2128] transition-colors cursor-pointer">
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
        </a>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Ticker Bar */}
        <div className="bg-[#161B22] border-b border-[#30363D] p-3 text-xs flex flex-wrap items-center gap-6 overflow-hidden">
          <span className="text-red-500 font-bold">₹ -0.10 (-0.01%)</span>
          <span className="font-medium flex items-center gap-1">
            <span className="w-4 h-4 bg-[#1F2937] rounded-full inline-block text-center text-[10px] leading-4">T</span>
            TCS 2,539.85 <span className="text-green-500">+66.30 (+2.68%)</span>
          </span>
          <span className="font-medium flex items-center gap-1">
            <span className="w-4 h-4 bg-[#1F2937] rounded-full inline-block text-center text-[10px] leading-4">H</span>
            HDFCBANK 772.05 <span className="text-green-500">+0.85 (+0.11%)</span>
          </span>
          <span className="font-medium flex items-center gap-1">
            <span className="w-4 h-4 bg-[#1F2937] rounded-full inline-block text-center text-[10px] leading-4">I</span>
            INFY 1,340.15 <span className="text-green-500">+34.00 (+2.60%)</span>
          </span>
          <span className="font-medium flex items-center gap-1">
            <span className="w-4 h-4 bg-[#1F2937] rounded-full inline-block text-center text-[10px] leading-4">R</span>
            RELIANCE 1,304.00 <span className="text-green-500">+12.00 (+0.93%)</span>
          </span>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 bg-[#0D1117]">
          {children}
        </div>
      </div>
    </div>
  );
}
