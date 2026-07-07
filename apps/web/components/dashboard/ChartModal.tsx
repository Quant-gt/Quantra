import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useScreener } from '@/context/ScreenerContext';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export const ChartModal: React.FC = () => {
  const { activeStockToken, isChartOpen, setIsChartOpen, activeIndicators, setActiveIndicators } = useScreener();

  const availableTemplates = ['EMA Cross', 'RSI Breakout', 'Volume Spikes'];

  return (
    <Dialog open={isChartOpen} onOpenChange={setIsChartOpen}>
      <DialogContent className="max-w-5xl bg-zinc-950 border border-zinc-800 text-zinc-100 h-[700px] flex flex-col p-4">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-zinc-800 pb-2">
          <div>
            <DialogTitle className="text-xl font-bold tracking-tight text-white">
              {activeStockToken ? activeStockToken : 'Select an Asset'}
            </DialogTitle>
            <p className="text-xs text-zinc-400">Real-time Advanced System Charting Viewport</p>
          </div>
        </DialogHeader>

        {/* Template Selector Bar */}
        <div className="flex items-center gap-2 py-2 border-b border-zinc-900 overflow-x-auto">
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">Templates:</span>
          {availableTemplates.map((template) => (
            <button
              key={template}
              className="text-xs px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors"
            >
              {template}
            </button>
          ))}
        </div>

        {/* Chart Canvas Area */}
        <div className="flex-1 bg-zinc-900/50 rounded-lg border border-zinc-900 my-4 flex items-center justify-center relative overflow-hidden">
          {/* Inject Canvas / Lightweight-Charts / Highcharts Wrapper element here */}
          <div className="text-center">
            <p className="text-zinc-500 text-sm">Interactive High-Frequency Vector Chart Canvas Engine</p>
            <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded mt-2 inline-block">
              Live Feed Connected
            </span>
          </div>
        </div>

        {/* Active Indicators Configuration Tray */}
        <div className="border-t border-zinc-900 pt-3 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-zinc-400">Active Nodes:</span>
          {activeIndicators.map((ind) => (
            <Badge key={ind} variant="secondary" className="bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center gap-1.5 py-0.5 px-2">
              {ind}
              <X size={12} className="cursor-pointer hover:text-red-400" onClick={() => setActiveIndicators(activeIndicators.filter(i => i !== ind))} />
            </Badge>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
