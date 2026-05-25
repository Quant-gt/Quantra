"use client";

import { useState } from 'react';
import VisualBuilder from '@/components/builder/VisualBuilder';
import BlockBuilder from '@/components/builder/BlockBuilder';
import MagicScanner from '@/components/builder/MagicScanner';
import { Sparkles, Zap, Network } from 'lucide-react';

export default function BuilderPage() {
  const [activeMode, setActiveMode] = useState<'magic' | 'block' | 'visual'>('magic');

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[#0D1117]">
      {/* Header & Toggle System */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363D] bg-[#0B0F19]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Stock Scanner & Builder
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Scan the market via AI or Execute algorithms on Live Data
          </p>
        </div>
        
        {/* Toggle Group */}
        <div className="flex bg-[#161B22] p-1 rounded-lg border border-[#30363D]">
          <button 
            onClick={() => setActiveMode('magic')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeMode === 'magic' 
                ? 'bg-[#30363D] text-white shadow-sm' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#21262D]'
            }`}
          >
            <Sparkles size={14} className={activeMode === 'magic' ? 'text-yellow-400' : ''} />
            Magic Scanner
          </button>
          
          <button 
            onClick={() => setActiveMode('block')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeMode === 'block' 
                ? 'bg-[#30363D] text-white shadow-sm' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#21262D]'
            }`}
          >
            <Zap size={14} className={activeMode === 'block' ? 'text-orange-400' : ''} />
            Strategy Block Builder
          </button>
          
          <button 
            onClick={() => setActiveMode('visual')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeMode === 'visual' 
                ? 'bg-[#30363D] text-white shadow-sm' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#21262D]'
            }`}
          >
            <Network size={14} className={activeMode === 'visual' ? 'text-[#388BFD]' : ''} />
            Visual Canvas
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-y-auto">
        {activeMode === 'visual' && <VisualBuilder />}
        {activeMode === 'block' && <BlockBuilder />}
        {activeMode === 'magic' && <MagicScanner />}
      </div>
    </div>
  );
}
