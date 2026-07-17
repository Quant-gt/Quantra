"use client";

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${title} | SigmaSpire Blog`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold bg-white/5 px-4 py-2 rounded-full hover:bg-white/10"
    >
      {copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
      {copied ? "Copied Link" : "Share"}
    </button>
  );
}
