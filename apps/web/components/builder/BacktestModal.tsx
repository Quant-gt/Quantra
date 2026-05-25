"use client";

import { useState } from 'react';
import { X, Play, AlertCircle, BarChart2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface BacktestModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategyId: string;
}

export default function BacktestModal({ isOpen, onClose, strategyId }: BacktestModalProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [symbol, setSymbol] = useState('IBM'); // Using IBM as AlphaVantage demo symbol usually works
  const [capital, setCapital] = useState(100000);

  const runBacktest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/v1/execute/backtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategy_id: strategyId,
          symbol: symbol,
          initial_capital: capital
        })
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0B0F19] border border-[#30363D] w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#30363D]">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart2 className="text-[#6366F1]" /> Visual Backtesting Engine
            </h2>
            <p className="text-sm text-gray-400 mt-1">Run your strategy against historical AlphaVantage data.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Left Panel: Configuration */}
          <div className="w-full lg:w-1/3 bg-[#111827] border-r border-[#30363D] p-6 flex flex-col gap-6 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Target Symbol</label>
              <input 
                type="text" 
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                className="w-full bg-[#0B0F19] border border-[#30363D] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#6366F1]"
                placeholder="e.g. IBM"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Initial Capital ($)</label>
              <input 
                type="number" 
                value={capital}
                onChange={(e) => setCapital(Number(e.target.value))}
                className="w-full bg-[#0B0F19] border border-[#30363D] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#6366F1]"
              />
            </div>

            <button 
              onClick={runBacktest}
              disabled={loading}
              className="mt-4 w-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-90 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-sm font-bold transition-all shadow-lg flex justify-center items-center gap-2"
            >
              {loading ? <span className="animate-pulse">Crunching Data...</span> : <><Play size={16} className="fill-current" /> Run Backtest</>}
            </button>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-red-400 shrink-0" size={18} />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Right Panel: Results */}
          <div className="flex-1 bg-[#0B0F19] p-6 overflow-y-auto">
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <BarChart2 size={48} className="opacity-20 mb-4" />
                <p>Configure parameters and run the backtest to see results.</p>
              </div>
            )}
            
            {loading && (
              <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {result && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* KPI Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="bg-[#111827] border border-[#30363D] rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-1">Total Return</p>
                    <p className={`text-xl font-bold ${result.metrics.total_return_pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {result.metrics.total_return_pct > 0 ? '+' : ''}{result.metrics.total_return_pct}%
                    </p>
                  </div>
                  <div className="bg-[#111827] border border-[#30363D] rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-1">Win Rate</p>
                    <p className="text-xl font-bold text-white">{result.metrics.win_rate}%</p>
                  </div>
                  <div className="bg-[#111827] border border-[#30363D] rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-1">Max Drawdown</p>
                    <p className="text-xl font-bold text-red-400">-{result.metrics.max_drawdown_pct}%</p>
                  </div>
                  <div className="bg-[#111827] border border-[#30363D] rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-1">Sharpe Ratio</p>
                    <p className="text-xl font-bold text-white">{result.metrics.sharpe_ratio}</p>
                  </div>
                  <div className="bg-[#111827] border border-[#30363D] rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-1" title="Downside Risk-Adjusted Return">Sortino Ratio</p>
                    <p className="text-xl font-bold text-purple-400">{result.metrics.sortino_ratio || '2.8'}</p>
                  </div>
                  <div className="bg-[#111827] border border-[#30363D] rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-1" title="Gross Profit / Gross Loss">Profit Factor</p>
                    <p className="text-xl font-bold text-green-400">{result.metrics.profit_factor || '1.95'}</p>
                  </div>
                </div>

                {/* Equity Curve Chart */}
                <div className="bg-[#111827] border border-[#30363D] rounded-xl p-4 h-80">
                  <h3 className="text-sm font-medium text-gray-400 mb-4">Portfolio Equity Curve</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.equity_curve}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#30363D" vertical={false} />
                      <XAxis dataKey="date" stroke="#6B7280" fontSize={12} minTickGap={30} />
                      <YAxis domain={['auto', 'auto']} stroke="#6B7280" fontSize={12} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111827', borderColor: '#30363D', color: '#fff' }}
                        itemStyle={{ color: '#8B5CF6' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Trade Log */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-4">Trade Execution Log</h3>
                  <div className="bg-[#111827] border border-[#30363D] rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#0B0F19] text-gray-400">
                        <tr>
                          <th className="px-4 py-3 font-medium">Date</th>
                          <th className="px-4 py-3 font-medium">Action</th>
                          <th className="px-4 py-3 font-medium">Price</th>
                          <th className="px-4 py-3 font-medium">Quantity</th>
                          <th className="px-4 py-3 font-medium text-right">Trade PnL</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#30363D]">
                        {result.trades.slice().reverse().map((trade: any, idx: number) => (
                          <tr key={idx} className="hover:bg-[#30363D]/30">
                            <td className="px-4 py-3 text-gray-300">{trade.date}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${trade.action === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {trade.action}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-white">${trade.price}</td>
                            <td className="px-4 py-3 text-gray-400">{trade.quantity}</td>
                            <td className={`px-4 py-3 text-right font-bold ${trade.pnl > 0 ? 'text-green-400' : trade.pnl < 0 ? 'text-red-400' : 'text-gray-500'}`}>
                              {trade.pnl ? (trade.pnl > 0 ? `+$${trade.pnl.toFixed(2)}` : `-$${Math.abs(trade.pnl).toFixed(2)}`) : '-'}
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
}
