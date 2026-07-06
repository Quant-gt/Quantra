"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Clock, BookOpen, X, ArrowLeft, ArrowUpRight, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  content: React.ReactNode;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "unlocking-alpha",
    title: "Unlocking Alpha: A Guide to Low-Latency Execution",
    excerpt: "Explore the architecture of modern direct market access (DMA) systems, including order routing, tick processing, and microsecond-level execution optimization.",
    date: "July 4, 2026",
    readTime: "6 min read",
    category: "Systematic Trading",
    tags: ["DMA", "Low-Latency", "C++", "Order Routing"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>
          In quantitative finance, alpha is a shrinking commodity. While signal quality is crucial, the mechanism of 
          execution—how quickly and cleanly you can route an order to an exchange—often determines whether a strategy 
          is profitable or drag-heavy. This guide explores the engineering principles behind direct market access (DMA) terminals.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">1. The Execution Lifecycle</h3>
        <p>
          A standard retail execution loop traverses multiple network hops, web servers, and third-party APIs. For professional 
          systematic desks, this layout is collapsed:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Tick Feed Ingestion:</strong> Subscribing directly to multicast market data feeds via UDP.</li>
          <li><strong>Order Matching Pipeline:</strong> Processing signals in-memory using lock-free rings and ring buffers (such as the LMAX Disruptor pattern).</li>
          <li><strong>Fix Protocol Routing:</strong> Translating logic commands directly into binary FIX (Financial Information eXchange) frames.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Mitigating Jitter in Python Services</h3>
        <p>
          While core low-latency engines are built in C++ or Rust, Python is heavily utilized for signal generation. To maintain 
          speed, follow these rules:
        </p>
        <div className="bg-[#161B22] p-4 rounded-xl font-mono text-xs text-emerald-400 space-y-1 my-4 overflow-x-auto border border-white/5">
          <div><span className="text-purple-400">import</span> gc</div>
          <div className="text-gray-500"># Disable automatic garbage collection during market hours</div>
          <div>gc.disable()</div>
          <div className="text-gray-500"># Pre-allocate memory blocks for streaming tickers</div>
          <div>ticker_pool = [TickerFrame() <span className="text-purple-400">for</span> _ <span className="text-purple-400">in</span> range(<span className="text-amber-500">10000</span>)]</div>
        </div>

        <p>
          By avoiding runtime allocations and garbage collector pauses (GC sweeps), execution services can sustain sub-millisecond latency.
        </p>
      </div>
    )
  },
  {
    id: "fyers-api-fallback",
    title: "Fyers API Integration: Mastering Live Auth Fallbacks",
    excerpt: "How to handle broker connection token persistence on ephemeral cloud container platforms by building Supabase Postgres fallbacks for secure daily auth checking.",
    date: "June 28, 2026",
    readTime: "5 min read",
    category: "Engineering",
    tags: ["Fyers API", "Supabase", "Token Auth", "FastAPI"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>
          Ephemeral hosting environments (such as Render, Fly.io, or serverless functions) wipe out local filesystems upon redeployments, 
          causing cached session tokens to disappear. If your systematic execution worker relies on a local file to store access keys, 
          redeploying your app will instantly lock you out.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Redundant Database Syncing</h3>
        <p>
          A modern solution is to couple local file reading (for speed) with an encrypted fallback inside a relational database 
          like Supabase:
        </p>
        <div className="bg-[#161B22] p-4 rounded-xl font-mono text-xs text-emerald-400 space-y-1 my-4 overflow-x-auto border border-white/5">
          <div><span className="text-purple-400">def</span> <span className="text-cyan-400">get_access_token</span>():</div>
          <div className="pl-4">token = read_local_cache()</div>
          <div className="pl-4"><span className="text-purple-400">if</span> <span className="text-purple-400">not</span> token:</div>
          <div className="pl-8 text-gray-500"># Fallback to Supabase REST endpoint</div>
          <div className="pl-8">token = fetch_from_supabase_db()</div>
          <div className="pl-8">write_local_cache(token)</div>
          <div className="pl-4"><span className="text-purple-400">return</span> token</div>
        </div>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Enforcing Encryption</h3>
        <p>
          Never store tokens in plain text in your database. Utilize symmetric XOR ciphering or AES-256 encryption using your 
          App Secret as a private salt. This guarantees that if your database is ever compromised, your trading execution keys 
          remain safe.
        </p>
      </div>
    )
  },
  {
    id: "sebi-compliance-rules",
    title: "SEBI Compliance: Hardening Strategy Validation Rules",
    excerpt: "An audit checklist for systematic retail trading setups in India, outlining SEBI RA limits, compliance kill switches, and anti-dummy algo verification.",
    date: "June 18, 2026",
    readTime: "4 min read",
    category: "Compliance",
    tags: ["SEBI Regulations", "Algo Validation", "Risk Management", "Daily 2FA"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>
          Systematic trading platforms operating in retail environments must conform strictly to regulatory frameworks. In India, 
          the Securities and Exchange Board of India (SEBI) imposes tight rules to protect retail investors from misleading 
          algorithmic performance figures and unauthorized trade triggers.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Algorithmic Id Validation</h3>
        <p>
          Regulatory validation checks must reject test patterns or placeholders. Simple checks should scan for:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Placeholder strings containing test patterns like 'XXX' or 'TEMP'.</li>
          <li>Repeating characters (e.g. 'AAAAAA') and simple sequential counts (e.g. '123456').</li>
          <li>Verification of a valid registered SEBI RA license suffix on strategy publisher accounts.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">2. The Mandatory Compliance Kill Switch</h3>
        <p>
          Every trading terminal must provide a master compliance kill switch that can be triggered by either the user or 
          the platform's administrator:
        </p>
        <div className="bg-[#161B22]/80 border border-red-500/20 p-4 rounded-xl flex items-start gap-4 my-6">
          <ShieldAlert className="text-red-400 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-bold text-white text-sm">Administrative Kill Switch Trigger</h4>
            <p className="text-xs text-gray-400 mt-1">
              Upon activation, all active WebSocket feeds are disconnected, and open market positions are immediately 
              closed or set to exit-only mode across all connected brokers.
            </p>
          </div>
        </div>

        <p>
          By embedding these validations natively in your Next.js frontend and Express/FastAPI backends, you ensure full 
          auditability during review passes.
        </p>
      </div>
    )
  },
  {
    id: "retail-algo-legality",
    title: "Is Algorithmic Trading Legal for Retail Investors in India?",
    excerpt: "Demystifying the regulations around retail API access and institutional prop-desk systems under the SEBI framework.",
    date: "May 14, 2026",
    readTime: "4 min read",
    category: "Compliance",
    tags: ["Regulations", "Retail Trading", "APIs", "SEBI"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>
          There is a massive amount of confusion surrounding the legality of algorithmic trading for retail investors in India. 
          If you browse online forums, check Reddit discussions, or read news reports, you will find highly conflicting opinions. 
          Some claim that retail algorithmic trading is illegal, while others argue it is perfectly fine. Let's separate the facts 
          from the rumors.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">1. The Institutional vs. Retail Split</h3>
        <p>
          The confusion stems from a failure to distinguish between two completely different types of trading setups:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Institutional Proprietary Desks:</strong> These setups run fully automated algorithms directly connected to high-speed exchanges (colocation servers). They are subject to rigorous SEBI testing, audit logs, and approval processes.</li>
          <li><strong>Retail Personal API Access:</strong> This is when a retail trader uses an API key provided by their broker (such as Zerodha Kite Connect, Fyers API, or Angel One SmartAPI) to execute trades through custom software or platforms.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Is Retail API Access Legal?</h3>
        <p>
          Yes. Under current SEBI guidelines, retail investors are allowed to use personal APIs to place trades. The broker is responsible for enforcing client-level risk management (like checking margin availability). Since the broker validates every order before sending it to the exchange, using personal APIs is 100% legal.
        </p>

        <p>
          However, where things become illegal is when someone hosts a shared database or runs a public portal that automates orders for multiple clients without holding a SEBI Registered Research Analyst (RA) or Investment Adviser (IA) license. Offering automated trading as a service to others without authorization violates SEBI's advisory regulations.
        </p>
      </div>
    )
  },
  {
    id: "sebi-ra-requirement",
    title: "What is a SEBI Registered Research Analyst (RA), and Why Does It Matter?",
    excerpt: "Why retail traders should rely on certified advisors rather than Telegram or YouTube channel execution groups.",
    date: "June 4, 2026",
    readTime: "4 min read",
    category: "Compliance",
    tags: ["SEBI RA", "Investor Protection", "Strategy Creators", "Ethics"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>
          With the rise of retail algorithmic trading, a new breed of "strategy creators" has emerged. Many operate through 
          Telegram channels, YouTube tutorials, or WhatsApp groups, promising overnight wealth through automated bots. 
          But how do you distinguish professional, regulated strategy publishers from unauthorized advisors?
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">1. The Role of a SEBI Research Analyst (RA)</h3>
        <p>
          A SEBI Registered Research Analyst (RA) is a certified professional authorized by the Securities and Exchange Board of 
          India to publish recommendations, strategies, and systematic models. RAs are bound by strict code-of-conduct guidelines:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Qualification & Auditing:</strong> RAs must hold specific financial qualifications and are subject to periodic regulatory compliance audits.</li>
          <li><strong>No Performance Hype:</strong> RAs are prohibited from showing exaggerated, unverified backtest statistics or promising guaranteed returns.</li>
          <li><strong>Conflict of Interest Disclosure:</strong> RAs must declare any personal holdings or financial interests in the strategies they publish.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">2. Why You Shouldn't Rely on Unregulated Advisors</h3>
        <p>
          Relying on unregulated Telegram channel bots exposes your capital to extreme risks:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Lack of Accountability:</strong> If an unregulated bot glitches or executes erroneous orders, you have no legal recourse or protection.</li>
          <li><strong>Hidden Incentives:</strong> Unregulated publishers often make money from affiliate commissions or proprietary trade front-running rather than strategy performance.</li>
        </ul>
        <p>
          Platforms like Quantra enforce that all public creators list their verified SEBI RA credentials, ensuring a safe, transparent marketplace for retail subscribers.
        </p>
      </div>
    )
  },
  {
    id: "verifying-algo-performance",
    title: "How to Verify if a Trading Algorithm's Performance is Real or Fake",
    excerpt: "A practical checklist for identifying curve-fitted backtests, hidden drawdowns, and unrealistic slippage assumptions.",
    date: "June 24, 2026",
    readTime: "5 min read",
    category: "Systematic Trading",
    tags: ["Backtesting", "Metrics Verification", "Slippage", "CAGR"],
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed text-sm md:text-base">
        <p>
          In systematic trading, backtesting is the foundation of strategy design. A backtest lets you evaluate how a set of 
          trading rules would have performed in historical market conditions. However, a beautiful backtest curve does not 
          always translate to real-world profitability.
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">1. Common Backtesting Pitfalls</h3>
        <p>
          Here is a checklist of critical factors to inspect when verifying strategy performance metrics:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Curve Fitting (Overfitting):</strong> Optimizing the strategy parameters to match historical data perfectly. An overfitted model performs exceptionally well in backtests but fails immediately in live execution.</li>
          <li><strong>Neglecting Slippage and Brokerage Fees:</strong> In live trading, you will rarely execute at the exact closing price. Slippage (difference between expected and executed price) and transaction taxes (STT, stamp duty) can turn a winning backtest into a losing live strategy.</li>
          <li><strong>Look-Ahead Bias:</strong> When a model accidentally incorporates future data (e.g. using today's closing price to calculate entry criteria at the open) during backtesting.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-8 mb-4">2. How to Verify Real-World Performance</h3>
        <p>
          Look for platforms that separate backtesting reports from live verification metrics. Live tracking (such as out-of-sample forward testing) verifies that the strategy continues to perform as expected against live feeds, ensuring full transparency.
        </p>
      </div>
    )
  }
];

export default function BlogIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const categories = ["All", "Systematic Trading", "Engineering", "Compliance"];

  // Filter posts
  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans relative overflow-y-auto pb-24">
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px]" />
      </div>

      <PublicNavbar />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-36">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-6"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Quantra Chronicles
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black mb-6 tracking-tight"
          >
            Insights on <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Systematic Trading</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-base md:text-lg leading-relaxed"
          >
            Deep dives into low-latency infrastructure, algorithmic execution, API fallbacks, and regulatory compliance.
          </motion.p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12 border-b border-white/5 pb-8">
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
                  selectedCategory === cat
                    ? "bg-emerald-500 text-black border-emerald-500 shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]"
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-4.5 w-4.5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-gray-600"
            />
          </div>

        </div>

        {/* Blog Post Grid */}
        <AnimatePresence mode="wait">
          {filteredPosts.length > 0 ? (
            <motion.div 
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  layoutId={`post-card-${post.id}`}
                  onClick={() => setSelectedPost(post)}
                  className="bg-[#0B0F19]/40 border border-white/5 rounded-3xl p-6 flex flex-col justify-between cursor-pointer hover:border-emerald-500/20 hover:bg-[#0B0F19]/60 transition-all group shadow-xl h-[340px]"
                >
                  <div>
                    {/* Metadata header */}
                    <div className="flex items-center gap-4 text-gray-500 text-xs mb-5">
                      <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] text-emerald-400 font-bold border border-white/5 uppercase tracking-wider">{post.category}</span>
                      <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                    </div>

                    <h3 className="text-white text-lg font-bold mb-3 leading-snug group-hover:text-emerald-400 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="border-t border-white/5 pt-4 flex items-center justify-between text-xs font-bold text-gray-500 group-hover:text-emerald-400 transition-colors">
                    <span className="flex items-center gap-1.5"><Clock size={12} /> {post.readTime}</span>
                    <span className="flex items-center gap-1">Read Article <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 text-gray-500"
            >
              No articles found matching your query.
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Blog Article Overlay Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 overflow-y-auto flex justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              layoutId={`post-card-${selectedPost.id}`}
              className="bg-[#0B0F19] border border-white/10 w-full max-w-4xl rounded-3xl shadow-2xl p-6 md:p-10 my-auto relative h-fit"
            >
              
              {/* Back / Close button */}
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-5">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-bold"
                >
                  <ArrowLeft size={16} /> Back to Articles
                </button>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-gray-500 hover:text-white p-2 hover:bg-white/5 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Title & Category Info */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-4 items-center text-xs text-gray-500 mb-4">
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3.5 py-1 rounded-full font-bold uppercase tracking-wider">{selectedPost.category}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={13} /> {selectedPost.date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={13} /> {selectedPost.readTime}</span>
                </div>
                <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
                  {selectedPost.title}
                </h1>
              </div>

              {/* Body Content */}
              <div className="border-t border-white/5 pt-8">
                {selectedPost.content}
              </div>

              {/* Tags Footer */}
              <div className="border-t border-white/5 pt-6 mt-10 flex flex-wrap gap-2 items-center">
                <span className="text-gray-500 text-xs font-bold mr-2">Tags:</span>
                {selectedPost.tags.map(tag => (
                  <span key={tag} className="bg-white/5 border border-white/5 text-gray-400 text-[10px] px-3 py-1 rounded-md font-medium">#{tag}</span>
                ))}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
