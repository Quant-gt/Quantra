"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  RefreshCw, 
  Download, 
  Star, 
  Maximize2, 
  Sliders, 
  Sparkles, 
  ChevronDown, 
  TrendingUp, 
  Grid, 
  Maximize, 
  Minimize, 
  Layers,
  X,
  Search,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useScreener } from '@/context/ScreenerContext';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  LineChart, 
  Line, 
  Legend, 
  CartesianGrid 
} from 'recharts';

interface ScreenerWidget {
  id: string;
  title: string;
  query: string;
  timeframe: '1m' | '5m' | '15m' | '1h' | '1d';
  layoutSize: 'small' | 'medium' | 'large';
  results: any[];
  isScanning: boolean;
  isPolling: boolean;
}

// Broad universe for widgets to fetch from
const BROAD_MARKET = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: 2450.45, change: 1.25, volume: 1540000, rsi: 62, macd: 1.2, ema20: 2420, close: 2450.45, open: 2420.10, high: 2465.00, low: 2415.00, sector: 'Energy', pe: 25.4, oichange: 3.5 },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', price: 3820.15, change: -0.85, volume: 890000, rsi: 41, macd: -0.8, ema20: 3840, close: 3820.15, open: 3855.00, high: 3860.00, low: 3810.00, sector: 'Technology', pe: 30.1, oichange: -1.2 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: 1610.80, change: 2.10, volume: 3450000, rsi: 74, macd: 2.5, ema20: 1580, close: 1610.80, open: 1578.00, high: 1615.00, low: 1575.00, sector: 'Financial Services', pe: 18.2, oichange: 8.4 },
  { symbol: 'INFY', name: 'Infosys Ltd.', price: 1475.30, change: 1.65, volume: 1200000, rsi: 58, macd: 0.9, ema20: 1455, close: 1475.30, open: 1450.00, high: 1482.00, low: 1448.00, sector: 'Technology', pe: 26.3, oichange: 2.1 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', price: 980.20, change: -1.15, volume: 2200000, rsi: 35, macd: -1.4, ema20: 995, close: 980.20, open: 992.00, high: 994.00, low: 978.00, sector: 'Financial Services', pe: 17.5, oichange: -4.5 },
  { symbol: 'SBIN', name: 'State Bank of India', price: 742.60, change: 0.45, volume: 4100000, rsi: 51, macd: 0.3, ema20: 740, close: 742.60, open: 739.00, high: 746.00, low: 737.00, sector: 'Financial Services', pe: 9.8, oichange: 0.8 },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd.', price: 3410.50, change: 2.45, volume: 750000, rsi: 69, macd: 4.1, ema20: 3320, close: 3410.50, open: 3330.00, high: 3425.00, low: 3325.00, sector: 'Construction', pe: 35.2, oichange: 12.5 },
  { symbol: 'ITC', name: 'ITC Ltd.', price: 428.15, change: -0.30, volume: 1800000, rsi: 48, macd: -0.1, ema20: 430, close: 428.15, open: 429.50, high: 431.00, low: 426.80, sector: 'Consumer Goods', pe: 28.1, oichange: -0.2 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.', price: 2315.40, change: 0.15, volume: 550000, rsi: 45, macd: 0.0, ema20: 2310, close: 2315.40, open: 2310.00, high: 2328.00, low: 2305.00, sector: 'Consumer Goods', pe: 55.4, oichange: 1.1 },
  { symbol: 'BHARTIALRT', name: 'Bharti Airtel Ltd.', price: 1125.75, change: -1.95, volume: 1650000, rsi: 28, macd: -3.2, ema20: 1150, close: 1125.75, open: 1148.00, high: 1150.00, low: 1122.00, sector: 'Telecommunications', pe: 65.0, oichange: -6.4 },
  { symbol: 'NTPC', name: 'NTPC Ltd.', price: 332.40, change: 3.20, volume: 5120000, rsi: 78, macd: 1.8, ema20: 320, close: 332.40, open: 322.00, high: 334.80, low: 321.10, sector: 'Utilities', pe: 15.6, oichange: 14.2 },
  { symbol: 'TRENT', name: 'Trent Ltd.', price: 3950.00, change: 4.80, volume: 950000, rsi: 81, macd: 5.6, ema20: 3750, close: 3950.00, open: 3770.00, high: 3975.00, low: 3760.00, sector: 'Consumer Goods', pe: 120.4, oichange: 18.6 },
];

export default function WorkspacePage() {
  const { watchlist, toggleWatchlist, historicalSnapshotTarget } = useScreener();
  const [widgets, setWidgets] = useState<ScreenerWidget[]>([
    {
      id: 'rsi-oversold',
      title: 'RSI Oversold Matrix',
      query: 'rsi < 40',
      timeframe: '15m',
      layoutSize: 'medium',
      results: [],
      isScanning: false,
      isPolling: false
    },
    {
      id: 'high-momentum',
      title: 'High Momentum Breakouts',
      query: 'change > 1.5 and rsi > 60',
      timeframe: '5m',
      layoutSize: 'small',
      results: [],
      isScanning: false,
      isPolling: false
    }
  ]);

  // Widget Creator States
  const [newTitle, setNewTitle] = useState('');
  const [newQuery, setNewQuery] = useState('');
  const [newTimeframe, setNewTimeframe] = useState<'1m' | '5m' | '15m' | '1h' | '1d'>('15m');
  const [newSize, setNewSize] = useState<'small' | 'medium' | 'large'>('small');

  // Charting Modal states
  const [selectedStock, setSelectedStock] = useState<any | null>(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeScreenerQuery, setActiveScreenerQuery] = useState('');

  // Hydrate all screeners on startup
  useEffect(() => {
    widgets.forEach(w => runWidgetScan(w.id));
  }, [historicalSnapshotTarget]);

  // Set up polling intervals
  useEffect(() => {
    const intervals = widgets.map(w => {
      if (w.isPolling) {
        return setInterval(() => {
          runWidgetScan(w.id);
        }, 15000); // 15s refresh
      }
      return null;
    });

    return () => {
      intervals.forEach(int => int && clearInterval(int));
    };
  }, [widgets]);

  const runWidgetScan = async (id: string) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, isScanning: true } : w));
    
    // Simulate low-latency query filtering
    setTimeout(() => {
      const widget = widgets.find(w => w.id === id);
      if (!widget) return;

      const query = (widget.query || '').toLowerCase().trim();
      
      // Filter logic mapped based on mathematical or conditional keys
      const filtered = BROAD_MARKET.filter(stock => {
        let priceVal = stock.price;
        let changeVal = stock.change;
        let rsiVal = stock.rsi;
        let macdVal = stock.macd;

        // Apply a small seed variation when historical snapshot target is set
        if (historicalSnapshotTarget) {
          const targetTime = new Date(historicalSnapshotTarget).getTime();
          let seed = 0;
          for (let i = 0; i < stock.symbol.length; i++) {
            seed += stock.symbol.charCodeAt(i);
          }
          const multiplier = 0.8 + (Math.sin(targetTime + seed) * 0.25);
          priceVal = parseFloat((priceVal * multiplier).toFixed(2));
          changeVal = parseFloat(((multiplier - 1) * 100).toFixed(2));
          rsiVal = Math.round(rsiVal * multiplier);
          macdVal = parseFloat((macdVal * multiplier).toFixed(1));
        }

        try {
          if (query.includes('rsi <')) {
            const val = parseFloat(query.split('rsi <')[1] || '0');
            return rsiVal < val;
          }
          if (query.includes('rsi >')) {
            const val = parseFloat(query.split('rsi >')[1] || '0');
            return rsiVal > val;
          }
          if (query.includes('change >')) {
            const val = parseFloat(query.split('change >')[1] || '0');
            return changeVal > val;
          }
          if (query.includes('change <')) {
            const val = parseFloat(query.split('change <')[1] || '0');
            return changeVal < val;
          }
          if (query.includes('macd >')) {
            const val = parseFloat(query.split('macd >')[1] || '0');
            return macdVal > val;
          }
          if (query.includes('macd <')) {
            const val = parseFloat(query.split('macd <')[1] || '0');
            return macdVal < val;
          }
          if (query.includes('pe <')) {
            const val = parseFloat(query.split('pe <')[1] || '0');
            return (stock.pe || 0) < val;
          }
          if (query.includes('pe >')) {
            const val = parseFloat(query.split('pe >')[1] || '0');
            return (stock.pe || 0) > val;
          }
          if (query.includes('oichange >')) {
            const val = parseFloat(query.split('oichange >')[1] || '0');
            return (stock.oichange || 0) > val;
          }
          if (query.includes('oichange <')) {
            const val = parseFloat(query.split('oichange <')[1] || '0');
            return (stock.oichange || 0) < val;
          }
        } catch(e) {}
        
        return rsiVal < 50; // default fallback matching middle matrix
      }).map(stock => {
        if (historicalSnapshotTarget) {
          const targetTime = new Date(historicalSnapshotTarget).getTime();
          let seed = 0;
          for (let i = 0; i < stock.symbol.length; i++) {
            seed += stock.symbol.charCodeAt(i);
          }
          const multiplier = 0.8 + (Math.sin(targetTime + seed) * 0.25);
          return {
            ...stock,
            price: parseFloat((stock.price * multiplier).toFixed(2)),
            change: parseFloat(((multiplier - 1) * 100).toFixed(2)),
            rsi: Math.min(100, Math.max(0, Math.round(stock.rsi * multiplier))),
            macd: parseFloat((stock.macd * multiplier).toFixed(1)),
            ema20: parseFloat((stock.ema20 * multiplier).toFixed(2)),
            close: parseFloat((stock.close * multiplier).toFixed(2)),
            open: parseFloat((stock.open * multiplier).toFixed(2)),
            high: parseFloat((stock.high * multiplier).toFixed(2)),
            low: parseFloat((stock.low * multiplier).toFixed(2)),
          };
        }
        return stock;
      });

      setWidgets(prev => prev.map(w => w.id === id ? { 
        ...w, 
        isScanning: false, 
        results: filtered 
      } : w));
    }, 800);
  };

  const handleCreateWidget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newQuery.trim()) {
      toast.error('Please input a screener title and query criteria');
      return;
    }
    const newId = `widget-${Date.now()}`;
    const newWidget: ScreenerWidget = {
      id: newId,
      title: newTitle,
      query: newQuery,
      timeframe: newTimeframe,
      layoutSize: newSize,
      results: [],
      isScanning: false,
      isPolling: false
    };

    setWidgets(prev => [...prev, newWidget]);
    setNewTitle('');
    setNewQuery('');
    toast.success(`Created screener widget: ${newTitle}`);
    setTimeout(() => runWidgetScan(newId), 100);
  };

  const handleRemoveWidget = (id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
    toast.info('Screener widget removed');
  };

  const handleTogglePolling = (id: string) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, isPolling: !w.isPolling } : w));
  };

  const handleResizeWidget = (id: string, size: 'small' | 'medium' | 'large') => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, layoutSize: size } : w));
  };

  const handleExportCSV = (widget: ScreenerWidget) => {
    if (widget.results.length === 0) {
      toast.error('No scan results available for export');
      return;
    }

    const headers = ['Symbol', 'Sector', 'Price', 'Change %', 'RSI (14)', 'MACD', 'EMA (20)'];
    const rows = widget.results.map(r => [
      r.symbol,
      r.sector,
      r.price,
      r.change,
      r.rsi,
      r.macd,
      r.ema20
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${widget.title.toLowerCase().replace(/\s+/g, '_')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${widget.title} results to CSV`);
  };

  const handleRowClick = (stock: any, query: string) => {
    setSelectedStock(stock);
    setActiveScreenerQuery(query.toLowerCase());
    setChartLoading(true);

    // Simulate OHLCV points generation
    setTimeout(() => {
      let currentPrice = stock.price;
      const dataPoints = [];
      const days = 30;

      for (let i = 0; i < days; i++) {
        const date = new Date(Date.now() - (days - i) * 86400000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        const dev = (Math.random() - 0.5) * (currentPrice * 0.025);
        currentPrice += dev;

        dataPoints.push({
          date,
          close: parseFloat(currentPrice.toFixed(2)),
          open: parseFloat((currentPrice * (1 - dev / 300)).toFixed(2)),
          high: parseFloat((currentPrice * 1.015).toFixed(2)),
          low: parseFloat((currentPrice * 0.985).toFixed(2)),
          volume: Math.round(500000 + Math.random() * 1500000),
          rsi: Math.round(stock.rsi + (Math.random() - 0.5) * 15),
          ema20: parseFloat((currentPrice * 0.99).toFixed(2))
        });
      }

      setChartData(dataPoints);
      setChartLoading(false);
    }, 650);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-[#0D1117] text-white">
      {/* Workspace Header Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-[#30363D]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="text-cyan-400" size={24} />
            Multi-Screener Workspace Layout
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Instantiate, tile, and tile-span dynamic cash/options query screeners into a unified operations canvas.
          </p>
        </div>

        {historicalSnapshotTarget && (
          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <span className="text-xs text-amber-400 font-bold font-mono">
              TIME TRAVEL: {new Date(historicalSnapshotTarget).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Widget Creator Panel */}
      <form onSubmit={handleCreateWidget} className="mb-8 p-6 bg-[#161B22]/60 border border-[#30363D] rounded-xl flex flex-wrap gap-4 items-end shadow-lg">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">Screener Title</label>
          <input 
            type="text"
            placeholder="e.g. RSI Oversold"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#58A6FF] text-white"
          />
        </div>

        <div className="flex-2 min-w-[280px]">
          <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">Query Criteria</label>
          <input 
            type="text"
            placeholder="e.g. rsi < 30 or change > 2.0"
            value={newQuery}
            onChange={(e) => setNewQuery(e.target.value)}
            className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3.5 py-2 text-sm outline-none focus:border-[#58A6FF] text-white font-mono"
          />
        </div>

        <div className="w-[120px]">
          <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">Timeframe</label>
          <select 
            value={newTimeframe}
            onChange={(e) => setNewTimeframe(e.target.value as any)}
            className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#58A6FF] text-white"
          >
            <option value="1m">1 min</option>
            <option value="5m">5 min</option>
            <option value="15m">15 min</option>
            <option value="1h">1 hour</option>
            <option value="1d">1 day</option>
          </select>
        </div>

        <div className="w-[130px]">
          <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">Grid Width</label>
          <select 
            value={newSize}
            onChange={(e) => setNewSize(e.target.value as any)}
            className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#58A6FF] text-white"
          >
            <option value="small">Small (1x)</option>
            <option value="medium">Medium (2x)</option>
            <option value="large">Large (3x)</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-400 text-gray-900 px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-md transition-colors cursor-pointer h-[38px]"
        >
          <Plus size={16} />
          Add Screener
        </button>
      </form>

      {/* Grid Layout Manager */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {widgets.map(w => {
            const sizeClass = w.layoutSize === 'large' 
              ? 'col-span-1 md:col-span-2 lg:col-span-3' 
              : w.layoutSize === 'medium' 
                ? 'col-span-1 md:col-span-2' 
                : 'col-span-1';

            return (
              <motion.div 
                key={w.id}
                layoutId={w.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                className={`bg-[#161B22]/50 border border-[#30363D] rounded-xl overflow-hidden shadow-2xl flex flex-col h-[420px] transition-colors ${
                  historicalSnapshotTarget ? 'hover:border-amber-500/30' : 'hover:border-[#58A6FF]/40'
                } ${sizeClass}`}
              >
                {/* Widget Header */}
                <div className="px-5 py-3.5 bg-[#1F242C]/40 border-b border-[#30363D] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${w.isPolling ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'}`} />
                      {w.title}
                    </h3>
                    <span className="text-[10px] text-gray-400 font-mono">{w.query} ({w.timeframe})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Size selectors */}
                    <div className="bg-[#0D1117] p-0.5 rounded border border-[#30363D] flex items-center gap-0.5">
                      <button 
                        type="button"
                        onClick={() => handleResizeWidget(w.id, 'small')}
                        title="Small Width"
                        className={`p-1 rounded text-[10px] font-bold ${w.layoutSize === 'small' ? 'bg-[#30363D] text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        1x
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleResizeWidget(w.id, 'medium')}
                        title="Medium Width"
                        className={`p-1 rounded text-[10px] font-bold ${w.layoutSize === 'medium' ? 'bg-[#30363D] text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        2x
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleResizeWidget(w.id, 'large')}
                        title="Full Width"
                        className={`p-1 rounded text-[10px] font-bold ${w.layoutSize === 'large' ? 'bg-[#30363D] text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        3x
                      </button>
                    </div>

                    <button 
                      type="button"
                      onClick={() => handleTogglePolling(w.id)}
                      className={`p-1.5 rounded border transition-colors ${w.isPolling ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-[#0D1117] border-[#30363D] text-gray-400 hover:text-white'}`}
                      title={w.isPolling ? 'Disable Auto-Refresh' : 'Enable 15s Auto-Refresh'}
                    >
                      <RefreshCw size={12} className={w.isPolling ? 'animate-spin' : ''} />
                    </button>

                    <button 
                      type="button"
                      onClick={() => handleExportCSV(w)}
                      className="p-1.5 rounded bg-[#0D1117] border border-[#30363D] text-gray-400 hover:text-white transition-colors"
                      title="Export CSV"
                    >
                      <Download size={12} />
                    </button>

                    <button 
                      type="button"
                      onClick={() => handleRemoveWidget(w.id)}
                      className="p-1.5 rounded bg-[#0D1117] border border-red-900/30 text-red-400 hover:bg-red-950/20 transition-colors"
                      title="Remove Widget"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Table Data Viewport */}
                <div className="flex-1 overflow-y-auto min-h-0 bg-[#0D1117]/30">
                  {w.isScanning ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <RefreshCw className="animate-spin text-cyan-400 mb-3" size={24} />
                      <p className="text-xs font-medium animate-pulse">Running pipeline matching...</p>
                    </div>
                  ) : w.results.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600">
                      <Layers size={24} className="mb-2 opacity-40" />
                      <p className="text-xs">No matching tickers found.</p>
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="sticky top-0 bg-[#161B22] border-b border-[#30363D] text-gray-400 text-[10px] uppercase font-mono">
                          <th className="px-4 py-2.5 w-10">Add</th>
                          <th className="px-4 py-2.5">Symbol</th>
                          <th className="px-4 py-2.5 text-right">Price</th>
                          <th className="px-4 py-2.5 text-right">Change</th>
                          <th className="px-4 py-2.5 text-right">RSI (14)</th>
                          <th className="px-4 py-2.5 text-right">P/E</th>
                          <th className="px-4 py-2.5 text-right">OI Chg</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#21262D]">
                        {w.results.map(r => {
                          const isBookmarked = watchlist.includes(r.symbol);
                          return (
                            <tr 
                              key={r.symbol}
                              onClick={() => handleRowClick(r, w.query)}
                              className="hover:bg-[#21262D]/60 transition-colors group cursor-pointer"
                            >
                              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                <motion.button
                                  type="button"
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => toggleWatchlist(r.symbol)}
                                  className={`p-1 rounded transition-colors ${isBookmarked ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'}`}
                                >
                                  <Star size={14} className={isBookmarked ? 'fill-current' : ''} />
                                </motion.button>
                              </td>
                              <td className="px-4 py-3 font-bold text-white">
                                <div>
                                  <span>{r.symbol}</span>
                                  <span className="block text-[10px] text-gray-500 font-normal truncate max-w-[120px]">{r.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right font-mono text-white">₹{r.price.toFixed(2)}</td>
                              <td className={`px-4 py-3 text-right font-mono font-bold ${r.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {r.change >= 0 ? '+' : ''}{r.change.toFixed(2)}%
                              </td>
                              <td className="px-4 py-3 text-right font-mono">
                                <span className={r.rsi > 70 ? 'text-orange-400' : r.rsi < 30 ? 'text-cyan-400' : 'text-gray-300'}>
                                  {r.rsi}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right font-mono text-gray-300">
                                {r.pe || '24.5'}
                              </td>
                              <td className={`px-4 py-3 text-right font-mono font-bold ${r.oichange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {r.oichange >= 0 ? '+' : ''}{(r.oichange || 2.5).toFixed(1)}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Click-to-Chart Modal dialog */}
      <AnimatePresence>
        {selectedStock && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-4xl bg-[#161B22] border border-[#30363D] rounded-xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 bg-[#1F242C]/50 border-b border-[#30363D] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg font-bold text-white leading-none">{selectedStock.symbol}</h2>
                    <span className="text-[10px] bg-[#30363D] text-gray-400 px-2 py-0.5 rounded font-mono uppercase tracking-wide">
                      {selectedStock.sector}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{selectedStock.name}</p>
                </div>

                <button 
                  type="button"
                  onClick={() => setSelectedStock(null)}
                  className="p-1.5 rounded-lg bg-[#0D1117] border border-[#30363D] text-gray-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body Canvas */}
              <div className="p-6 bg-[#0D1117]/30 flex-1 min-h-[400px]">
                {chartLoading ? (
                  <div className="h-[350px] flex flex-col items-center justify-center animate-pulse">
                    <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-sm font-bold text-gray-400">Simulating Broad Market OHLCV Feed...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Price Chart */}
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
                          <XAxis dataKey="date" stroke="#8B949E" fontSize={10} />
                          <YAxis stroke="#8B949E" domain={['auto', 'auto']} fontSize={10} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#161B22', borderColor: '#30363D' }} 
                            labelStyle={{ color: '#8B949E', fontSize: 11 }}
                            itemStyle={{ color: '#fff', fontSize: 11 }}
                          />
                          <Legend wrapperStyle={{ fontSize: 10 }} />
                          
                          <Line 
                            name="Close Price" 
                            type="monotone" 
                            dataKey="close" 
                            stroke="#58A6FF" 
                            strokeWidth={2} 
                            dot={false}
                            activeDot={{ r: 4 }}
                          />
                          
                          {/* Dynamically overlay EMA if query contains EMA */}
                          {(activeScreenerQuery.includes('ema') || activeScreenerQuery.includes('golden')) && (
                            <Line 
                              name="EMA (20)" 
                              type="monotone" 
                              dataKey="ema20" 
                              stroke="#FF8C00" 
                              strokeWidth={1.5} 
                              dot={false}
                            />
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Indicator Pane (e.g. RSI) */}
                    {activeScreenerQuery.includes('rsi') && (
                      <div className="h-[100px] w-full border-t border-[#30363D] pt-4">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-mono block mb-1">RSI (14) Pane</span>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
                            <XAxis dataKey="date" hide />
                            <YAxis stroke="#8B949E" domain={[0, 100]} fontSize={8} tickCount={3} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#161B22', borderColor: '#30363D' }} 
                              itemStyle={{ color: '#fff', fontSize: 10 }}
                            />
                            
                            <Area 
                              name="RSI" 
                              type="monotone" 
                              dataKey="rsi" 
                              stroke="#FFD700" 
                              fill="#FFD700" 
                              fillOpacity={0.05} 
                              dot={false}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-[#1F242C]/40 border-t border-[#30363D] flex justify-between items-center text-xs text-gray-400">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-mono block">Volume Feed</span>
                    <span className="font-mono text-white">{(selectedStock.volume / 1000000).toFixed(2)}M shares</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-mono block">Day High/Low</span>
                    <span className="font-mono text-white">₹{selectedStock.high?.toFixed(2)} - ₹{selectedStock.low?.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      toggleWatchlist(selectedStock.symbol);
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      watchlist.includes(selectedStock.symbol)
                        ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.2)]'
                        : 'bg-[#0D1117] border-[#30363D] text-gray-400 hover:text-white'
                    }`}
                  >
                    <Star size={12} className={watchlist.includes(selectedStock.symbol) ? 'fill-current' : ''} />
                    {watchlist.includes(selectedStock.symbol) ? 'Starred' : 'Add to Watchlist'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedStock(null)}
                    className="bg-cyan-500 hover:bg-cyan-400 text-gray-900 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Close Portal
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
