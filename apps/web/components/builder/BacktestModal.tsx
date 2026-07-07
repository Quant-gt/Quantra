"use client";

import React, { useState, memo } from 'react';
import { X, Play, BarChart2, AlertCircle } from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  strategyId: string;
}

const BacktestModal = ({ isOpen, onClose, strategyId }: Props) => {
  const [symbol, setSymbol] = useState('RELIANCE');
  const [capital, setCapital] = useState(100000);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runBacktest = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/execute/backtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategy_id: strategyId, symbol, initial_capital: capital })
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Backtest failed');
      }
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 md:p-4">
      <div className="bg-[#0B0F19] border border-[#30363D] w-full max-w-6xl h-[95vh] md:h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-[#30363D]">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <BarChart2 className="text-[#6366F1]" /> Backtesting Engine
            </h2>
            <p className="text-xs md:text-sm text-gray-400 mt-1">Simulate strategy on historical data.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Configuration Sidebar */}
          <div className="w-full lg:w-80 bg-[#111827] border-b lg:border-b-0 lg:border-r border-[#30363D] p-4 md:p-6 flex flex-col gap-4 overflow-y-auto">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Symbol</label>
              <input 
                type="text" 
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                className="w-full bg-[#0B0F19] border border-[#30363D] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#6366F1] text-sm"
                placeholder="e.g. NIFTY"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Capital (₹)</label>
              <input 
                type="number" 
                value={capital}
                onChange={(e) => setCapital(Number(e.target.value))}
                className="w-full bg-[#0B0F19] border border-[#30363D] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#6366F1] text-sm"
              />
            </div>

            <button 
              onClick={runBacktest}
              disabled={loading}
              className="mt-2 w-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-90 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-sm font-bold transition-all shadow-lg flex justify-center items-center gap-2"
            >
              {loading ? <span className="animate-pulse">Analyzing...</span> : <><Play size={16} className="fill-current" /> Run Test</>}
            </button>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-3">
                <AlertCircle className="text-red-400 shrink-0" size={16} />
                <p className="text-xs text-red-400 font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* Results Main Area */}
          <div className="flex-1 bg-[#0D1117] p-4 md:p-6 overflow-y-auto">
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-gray-600">
                <BarChart2 size={64} className="opacity-10 mb-4" />
                <p className="text-sm font-medium">Ready to start backtest</p>
              </div>
            )}
            
            {loading && (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xs text-gray-500 animate-pulse font-bold uppercase tracking-widest">Processing Market Data</p>
              </div>
            )}

            {result && (
              <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
                  {[
                    { label: 'Return', val: `${result.metrics.total_return_pct > 0 ? '+' : ''}${result.metrics.total_return_pct}%`, color: result.metrics.total_return_pct >= 0 ? 'text-green-400' : 'text-red-400' },
                    { label: 'Win Rate', val: `${result.metrics.win_rate}%`, color: 'text-white' },
                    { label: 'Max DD', val: `-${result.metrics.max_drawdown_pct}%`, color: 'text-red-400' },
                    { label: 'Sharpe', val: result.metrics.sharpe_ratio, color: 'text-white' },
                    { label: 'Sortino', val: result.metrics.sortino_ratio || '-', color: 'text-purple-400' },
                    { label: 'PF', val: result.metrics.profit_factor || '-', color: 'text-green-400' }
                  ].map((m, i) => (
                    <div key={i} className="bg-[#161B22] border border-[#30363D] rounded-xl p-3 md:p-4">
                      <p className="text-[10px] md:text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">{m.label}</p>
                      <p className={`text-lg md:text-xl font-bold ${m.color}`}>{m.val}</p>
                    </div>
                  ))}
                </div>

                {/* Chart Area */}
                <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 h-64 md:h-80 shadow-inner">
                  <h3 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">Equity Curve</h3>
                  <div className="w-full h-full pb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={result.equity_curve}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#30363D" vertical={false} />
                        <XAxis dataKey="date" stroke="#4B5563" fontSize={10} minTickGap={50} />
                        <YAxis domain={['auto', 'auto']} stroke="#4B5563" fontSize={10} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0D1117', border: '1px solid #30363D', borderRadius: '8px' }}
                          itemStyle={{ color: '#8B5CF6', fontSize: '12px' }}
                          labelStyle={{ color: '#9CA3AF', fontSize: '10px', marginBottom: '4px' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Table Area */}
                <div className="overflow-hidden">
                  <h3 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">Trade Journal</h3>
                  <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-x-auto shadow-xl">
                    <table className="w-full text-left text-xs md:text-sm">
                      <thead className="bg-[#0D1117] text-gray-500 uppercase tracking-widest font-bold">
                        <tr>
                          <th className="px-4 py-4 font-bold border-b border-[#30363D]">Date</th>
                          <th className="px-4 py-4 font-bold border-b border-[#30363D]">Action</th>
                          <th className="px-4 py-4 font-bold border-b border-[#30363D]">Price</th>
                          <th className="px-4 py-4 font-bold border-b border-[#30363D] text-right">PnL</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#30363D]">
                        {result.trades.slice().reverse().map((trade: any, idx: number) => (
                          <tr key={idx} className="hover:bg-[#1F2937]/50 transition-colors">
                            <td className="px-4 py-4 text-gray-300 font-mono">{trade.date}</td>
                            <td className="px-4 py-4">
                              <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${trade.action === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                {trade.action}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-white font-bold">₹{trade.price.toLocaleString()}</td>
                            <td className={`px-4 py-4 text-right font-black ${trade.pnl > 0 ? 'text-emerald-400' : trade.pnl < 0 ? 'text-red-400' : 'text-gray-500'}`}>
                              {trade.pnl ? (trade.pnl > 0 ? `+₹${trade.pnl.toLocaleString()}` : `-₹${Math.abs(trade.pnl).toLocaleString()}`) : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(BacktestModal);
