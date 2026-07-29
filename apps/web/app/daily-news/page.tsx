"use client";

import React, { useState, useEffect } from 'react';
import PublicNavbar from '@/components/PublicNavbar';
import { Clock, TrendingUp, TrendingDown, ExternalLink, Activity, Filter, Loader2, Newspaper } from 'lucide-react';
import Link from 'next/link';

function timeAgo(dateParam: Date | string) {
  if (!dateParam) return null;
  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const today = new Date();
  const seconds = Math.round((today.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

type NewsItem = {
  id: string;
  title: string;
  summary: string;
  ticker: string;
  price_change: string;
  category: string;
  sector: string;
  timestamp: string;
  source_url: string;
};

const CATEGORIES = [
  "All Updates",
  "Company News",
  "Announcements (BSE/NSE)",
  "Earnings",
  "FII / DII Flows"
];

export default function DailyNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Updates");

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        if (Array.isArray(data)) {
          setNews(data);
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const matchesCategory = (itemCategory: string, selectedTab: string) => {
    if (selectedTab === "All Updates") return true;
    
    const normItem = itemCategory.toLowerCase().replace(/[^a-z0-9]/g, "");
    const normTab = selectedTab.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    return normItem.includes(normTab) || normTab.includes(normItem);
  };

  const filteredNews = news.filter(item => matchesCategory(item.category, activeCategory));

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white font-sans selection:bg-emerald-500/30 selection:text-white pb-24">
      <PublicNavbar />

      {/* Banner Section */}
      <div className="relative border-b border-white/5 bg-[#0D1117]/80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold mb-6">
            <Activity size={16} /> Live Market Feed
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Daily Market News & Corporate Updates
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Real-time stock news, BSE/NSE announcements, corporate earnings, and FII/DII activity pulled directly from financial feeds.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Filter size={18} className="text-gray-500 mr-2 flex-shrink-0" />
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeCategory === category 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                    : "bg-[#161B22] text-gray-400 border border-white/5 hover:bg-[#21262D] hover:text-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500">
            <Loader2 size={48} className="animate-spin mb-4 text-emerald-500/50" />
            <p className="font-medium tracking-wide">Aggregating Live Financial Feeds...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredNews.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500 bg-[#161B22]/30 rounded-2xl border border-white/5 border-dashed">
            <Newspaper size={48} className="mb-4 opacity-50" />
            <p className="font-medium">No updates found for "{activeCategory}" at this time.</p>
          </div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => {
            const isPositive = parseFloat(item.price_change) >= 0;
            const parsedDate = new Date(item.timestamp);
            const timeAgoStr = isNaN(parsedDate.getTime()) ? item.timestamp : timeAgo(parsedDate);

            return (
              <div 
                key={item.id} 
                className="group relative flex flex-col bg-[#161B22]/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:bg-[#1C2128] transition-all hover:border-white/10 hover:shadow-2xl overflow-hidden"
              >
                {/* Top Badges */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.category}
                    </span>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-white/5 text-gray-400 border border-white/5">
                      {item.sector}
                    </span>
                  </div>
                </div>

                {/* Ticker Chip */}
                {item.ticker !== 'MARKET' && (
                  <Link href={`/dashboard/builder?symbol=${item.ticker}`} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D1117] border border-white/5 w-max mb-4 hover:border-white/20 transition-colors">
                    <span className="text-white font-bold text-xs">{item.ticker}</span>
                    <span className="text-gray-600 text-xs">|</span>
                    <span className={`text-xs font-bold flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-rose-500'}`}>
                      {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {item.price_change}
                    </span>
                  </Link>
                )}
                {item.ticker === 'MARKET' && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D1117] border border-white/5 w-max mb-4">
                    <span className="text-white font-bold text-xs">BROAD MARKET</span>
                  </div>
                )}

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-100 leading-snug mb-3 group-hover:text-white transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6 line-clamp-2 flex-grow">
                  {item.summary}
                </p>

                {/* Bottom Bar */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                    <Clock size={14} />
                    {timeAgoStr}
                  </div>
                  <a 
                    href={item.source_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors"
                  >
                    Read Source <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
