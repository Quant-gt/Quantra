"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Users, Database, Settings, Menu, X, History } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  return (
    <div className="flex h-[100dvh] bg-[#0B0F19] text-white font-sans overflow-hidden">
      
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0D1117] border-r border-[#30363D] flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-[#30363D]">
          <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 flex items-center gap-2">
            <Shield size={24} className="text-red-500" />
            Quantra Admin
          </h1>
          <p className="text-xs text-gray-500 mt-1">Platform Management</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-[#1C2128] rounded-md transition-colors">
            <Settings size={18} className="text-gray-400" />
            <span className="text-sm font-medium">Platform Overview</span>
          </Link>
          <Link href="/admin/compliance" className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-[#1C2128] rounded-md transition-colors">
            <Shield size={18} className="text-blue-400" />
            <span className="text-sm font-medium">Compliance (KYC)</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-[#1C2128] rounded-md transition-colors">
            <Users size={18} className="text-green-400" />
            <span className="text-sm font-medium">User Management</span>
          </Link>
          <Link href="/admin/marketplace" className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-[#1C2128] rounded-md transition-colors">
            <Database size={18} className="text-purple-400" />
            <span className="text-sm font-medium">Marketplace Algos</span>
          </Link>
          <Link href="/admin/engine" className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-[#1C2128] rounded-md transition-colors">
            <Settings size={18} className="text-yellow-400 animate-pulse" />
            <span className="text-sm font-medium">Execution Engine</span>
          </Link>
          <Link href="/admin/backtesting" className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-[#1C2128] rounded-md transition-colors">
            <History size={18} className="text-orange-400" />
            <span className="text-sm font-medium">Backtesting</span>
          </Link>
          <Link href="/admin/ai-creator" className="flex items-center gap-3 px-3 py-2 mt-4 text-[#58A6FF] hover:text-white hover:bg-[#1C2128] rounded-md transition-colors border border-[#58A6FF]/20 bg-[#58A6FF]/5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
            </svg>
            <span className="text-sm font-bold">AI Creator</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-[#30363D]">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white transition-colors">
            <span className="text-sm font-medium">← Back to App</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#0B0F19] w-full">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-[#0D1117] border-b border-[#30363D]">
          <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 flex items-center gap-2">
            <Shield size={24} className="text-red-500" />
            Quantra Admin
          </h1>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
