"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Activity, Play, Zap, AlertTriangle } from "lucide-react";

export default function AIStrategyBuilder() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [strategy, setStrategy] = useState<any>(null);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate strategy");
      
      setStrategy(data);
      setResults(null); // Reset optimization results if new strategy generated
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (!strategy) return;
    setOptimizing(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(strategy),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to optimize strategy");
      
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-white/10 bg-slate-900/50 flex items-center px-6 sticky top-0 backdrop-blur-md z-10">
        <Link href="/builder" className="flex items-center text-slate-400 hover:text-white transition-colors mr-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Visual Builder
        </Link>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h1 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            AI Strategy Prompt Generator
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-10 space-y-8">
        {/* Input Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-semibold mb-1">Describe your strategy</h2>
              <p className="text-slate-400 text-sm">Convert plain English into a production-ready vectorized backtest.</p>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Buy Nifty 50 when the 50 SMA crosses the 200 SMA and RSI is below 30. Stop loss at 2.5x ATR."
              className="relative w-full h-32 bg-slate-900 border border-white/10 rounded-xl p-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Intent...
                </span>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Generate & Backtest
                </>
              )}
            </button>
          </div>
          
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </section>

        {/* Results Section */}
        {strategy && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Parsed Strategy */}
            <section className="bg-slate-900 border border-white/10 rounded-xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-lg">Parsed Strategy Schema</h3>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-3 rounded-lg border border-white/5">
                    <span className="text-slate-500 block mb-1">Market</span>
                    <span className="font-medium">{strategy.market}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-white/5">
                    <span className="text-slate-500 block mb-1">Timeframe</span>
                    <span className="font-medium">{strategy.timeframe}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-white/5">
                  <span className="text-slate-500 block mb-2">Indicators Extracted</span>
                  <div className="flex flex-wrap gap-2">
                    {strategy.indicators?.map((ind: any, i: number) => (
                      <span key={i} className="px-2 py-1 bg-slate-800 rounded text-xs font-mono">
                        {ind.name} ({ind.period})
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-white/5">
                  <span className="text-slate-500 block mb-2">Entry Logic</span>
                  <div className="space-y-1 font-mono text-emerald-400">
                    {strategy.entry_logic?.map((logic: string, i: number) => (
                      <div key={i}>AND {logic}</div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-slate-950 p-3 rounded-lg border border-white/5">
                  <span className="text-slate-500 block mb-2">Stop Loss / Exit</span>
                  <div className="font-mono text-rose-400">ATR Multiplier: {strategy.stop_loss_atr}x</div>
                  {strategy.exit_logic?.map((logic: string, i: number) => (
                    <div key={i} className="font-mono text-rose-400 mt-1">OR {logic}</div>
                  ))}
                </div>
              </div>
            </section>

            {/* Optimization Panel */}
            <section className="bg-slate-900 border border-white/10 rounded-xl p-6 shadow-xl flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <h3 className="font-semibold text-lg">Evolutionary Optimizer</h3>
                </div>
                <button
                  onClick={handleOptimize}
                  disabled={optimizing}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-white/10 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  {optimizing ? (
                    <>
                      <div className="w-3 h-3 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    "Target >85% Win Rate"
                  )}
                </button>
              </div>

              {results ? (
                <div className="flex-1 space-y-6">
                  <div className="p-4 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-xl">
                    <h4 className="text-sm font-medium text-indigo-300 mb-3">Optimal Parameters Found</h4>
                    <div className="grid gap-2">
                      {Object.entries(results.best_parameters).map(([key, val]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-slate-400 font-mono">{key}</span>
                          <span className="font-bold text-white">{val as any}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-white/5 text-center">
                      <span className="text-slate-500 text-sm block mb-1">Win Rate</span>
                      <span className="text-3xl font-bold text-emerald-400">{results.optimized_metrics.win_rate_pct}%</span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-white/5 text-center">
                      <span className="text-slate-500 text-sm block mb-1">Max Drawdown</span>
                      <span className="text-3xl font-bold text-rose-400">{results.optimized_metrics.max_drawdown_pct}%</span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-white/5 text-center">
                      <span className="text-slate-500 text-sm block mb-1">Total Return</span>
                      <span className="text-3xl font-bold text-indigo-400">{results.optimized_metrics.total_return_pct}%</span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-white/5 text-center">
                      <span className="text-slate-500 text-sm block mb-1">Total Trades</span>
                      <span className="text-3xl font-bold text-slate-100">{results.optimized_metrics.total_trading_days}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-white/5 rounded-xl">
                  <Zap className="w-8 h-8 text-slate-700 mb-3" />
                  <p className="text-sm text-slate-400">
                    Run the Optuna evolutionary algorithm to safely find the best indicator periods without exceeding 15% Max Drawdown.
                  </p>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
