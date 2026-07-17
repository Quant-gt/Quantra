"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Clock, BookOpen, X, ArrowLeft, ArrowUpRight, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';
import { BLOG_POSTS, BlogPost } from '../../lib/blog-data';

export default function BlogIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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
            SigmaSpire Chronicles
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
                <Link href={`/blog/${post.id}`} key={post.id}>
                  <motion.div
                    layoutId={`post-card-${post.id}`}
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
                </Link>
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
    </div>
  );
}
