"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  ArrowUpRight,
  Menu,
  X,
  Layers
} from 'lucide-react';
import { useState, useEffect } from 'react';
import LiveTickerTape from '@/components/dashboard/LiveTickerTape';
import { ScreenerProvider } from '@/context/ScreenerContext';
import { BYOBGatewayModal } from '@/components/dashboard/byob-gateway-modal';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeBroker, setActiveBroker] = useState<string | null>(null);
  const [isSandbox, setIsSandbox] = useState<boolean>(false);

  const [currentView, setCurrentView] = useState<string>('user');

  const fetchBrokerStatus = () => {
    const broker = localStorage.getItem("sigmaspire_broker_name");
    const sandbox = localStorage.getItem("sigmaspire_broker_sandbox") === "true";
    setActiveBroker(broker);
    setIsSandbox(sandbox);
  };

  useEffect(() => {
    fetchBrokerStatus();
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/v1/onboarding/load');
        if (res.ok) {
          const profile = await res.json();
          setCurrentView(profile.current_view || 'user');
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const getLinkClass = (href: string) => {
    const isActive = pathname === href;
    return `flex items-center gap-3 px-6 py-3 transition-colors ${
      isActive 
        ? 'bg-[#1F2937] text-[#58A6FF] font-medium border-l-4 border-[#388BFD]' 
        : 'text-gray-400 hover:bg-[#1F2937] hover:text-white border-l-4 border-transparent'
    }`;
  };

  return (
    <ScreenerProvider>
      <div className="flex h-[100dvh] bg-[#0D1117] text-white overflow-hidden font-sans">
        
        {/* Mobile Drawer Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <div className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-[#161B22] border-r border-[#30363D] transition-transform duration-300 md:translate-x-0 md:static md:flex md:flex-col
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex items-center gap-3 px-6 py-5 border-b border-[#30363D]">
            <div className="w-8 h-8 bg-white flex items-center justify-center rounded-lg shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight">SigmaSpire</span>
              {isSandbox ? (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-cyan-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Sandbox (Active)
                  </span>
                  <button onClick={() => window.dispatchEvent(new CustomEvent('open-byob-modal'))} className="text-[10px] text-zinc-500 hover:text-white underline decoration-zinc-600 underline-offset-2 transition-colors cursor-pointer">Switch</button>
                </div>
              ) : activeBroker ? (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {activeBroker} (Linked)
                  </span>
                  <button onClick={() => window.dispatchEvent(new CustomEvent('open-byob-modal'))} className="text-[10px] text-zinc-500 hover:text-white underline decoration-zinc-600 underline-offset-2 transition-colors cursor-pointer">Change</button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-red-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Broker Unlinked
                  </span>
                  <button onClick={() => window.dispatchEvent(new CustomEvent('open-byob-modal'))} className="text-[10px] text-emerald-500 hover:text-emerald-400 underline decoration-emerald-500/50 underline-offset-2 transition-colors font-bold cursor-pointer">Link API</button>
                </div>
              )}
            </div>
          </div>

          <nav className="flex-1 py-4 overflow-y-auto">
            <Link href="/dashboard" className={getLinkClass('/dashboard')}>
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Link href="/dashboard/scanner" className={getLinkClass('/dashboard/scanner')}>
              <Search size={18} />
              Stock Scanner
            </Link>
            {currentView === 'creator' && (
              <>
                <Link href="/dashboard/builder" className={getLinkClass('/dashboard/builder')}>
                  <SlidersHorizontal size={18} />
                  Strategy Builder
                </Link>
                <Link href="/dashboard/scans" className={getLinkClass('/dashboard/scans')}>
                  <SlidersHorizontal size={18} />
                  Custom Scans
                </Link>
              </>
            )}
            
            {currentView === 'user' && (
              <>
                <Link href="/dashboard/autotrade" className={getLinkClass('/dashboard/autotrade')}>
                  <Zap size={18} />
                  Auto Trade
                </Link>
              </>
            )}

            <Link href="/dashboard/charts" className={getLinkClass('/dashboard/charts')}>
              <BarChart2 size={18} />
              Live Charts
            </Link>
            <Link href="/dashboard/backtesting" className={getLinkClass('/dashboard/backtesting')}>
              <History size={18} />
              Backtesting
            </Link>
            
            <div className="mt-8 px-6 text-xs font-semibold text-gray-500 mb-2">SYSTEM</div>
            <Link href="/dashboard/settings" className={getLinkClass('/dashboard/settings')}>
              <Settings size={18} />
              Settings
            </Link>
          
            <div className="mt-8 px-6 text-xs font-semibold text-gray-500 mb-2">COMMUNITY</div>
            <Link href="/dashboard/feed" className={getLinkClass('/dashboard/feed')}>
              <Globe size={18} />
              Social Feed
            </Link>
            
            {currentView === 'creator' && (
              <Link href="/creator" className="flex items-center justify-between px-6 py-3 text-gray-400 hover:bg-[#1F2937] hover:text-white transition-colors group border-l-4 border-transparent">
                <div className="flex items-center gap-3">
                  <Activity size={18} />
                  Creator Studio
                </div>
              </Link>
            )}
          </nav>

          <div className="p-4 border-t border-[#30363D]">
            <Link 
              href="/auth/login" 
              onClick={() => {
                // clear token/session
                fetch('/api/auth/signout', { method: 'POST' });
              }}
              className="flex items-center gap-3 px-6 py-3 text-red-400 hover:bg-red-950/20 hover:text-red-300 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Logout
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between p-4 bg-[#161B22] border-b border-[#30363D]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white flex items-center justify-center rounded-lg shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">SigmaSpire</span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-gray-400 hover:text-white"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Top Ticker Bar */}
          <LiveTickerTape />

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-4 md:p-6 bg-[#0D1117]">
            {children}
          </div>
        </div>
      </div>
      <BYOBGatewayModal onSuccess={fetchBrokerStatus} />
    </ScreenerProvider>
  );
}
