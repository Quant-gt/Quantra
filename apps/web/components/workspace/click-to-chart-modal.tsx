"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickSeries, LineSeries } from "lightweight-charts";
import { Loader2, Lock, Zap, ArrowRight, ShieldCheck, Activity } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface OHLCVData {
  time: string; // Format: YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface ActiveIndicator {
  id: string;
  name: string;
  type: "MA" | "BB" | "PRICE";
  color: string;
  calculate: (data: OHLCVData[]) => { time: string; value: number }[];
}

interface ClickToChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticker: string;
  exchange: "NSE" | "BSE";
  activeIndicators?: ActiveIndicator[];
}

export function ClickToChartModal({
  isOpen,
  onClose,
  ticker,
  exchange,
  activeIndicators = [],
}: ClickToChartModalProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [metaMetrics, setMetaMetrics] = useState({ price: 0, change: 0 });
  const [activeTimeframe, setActiveTimeframe] = useState<"1d" | "15m" | "1m">("1d");
  const [showGatePrompt, setShowGatePrompt] = useState<boolean>(false);
  const [gateReason, setGateReason] = useState<string>("");

  useEffect(() => {
    if (!isOpen || !chartContainerRef.current) return;
    setIsLoading(true);

    const generateMockOHLCV = (): OHLCVData[] => {
      const data: OHLCVData[] = [];
      let basePrice = 2400 + Math.random() * 200;
      const today = new Date();
      for (let i = 180; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split("T")[0]!;
        const open = basePrice + (Math.random() - 0.5) * 30;
        const high = open + Math.random() * 40;
        const low = open - Math.random() * 40;
        const close = (open + high + low) / 3 + (Math.random() - 0.5) * 15;
        data.push({ time: dateString, open, high, low, close, volume: 100000 });
        basePrice = close;
      }
      return data;
    };

    const historicalData = generateMockOHLCV();
    const latestBar = historicalData[historicalData.length - 1]!;
    const previousBar = historicalData[historicalData.length - 2]!;
    setMetaMetrics({ price: latestBar.close, change: ((latestBar.close - previousBar.close) / previousBar.close) * 100 });

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#09090b" },
        textColor: "#a1a1aa",
      },
      grid: { vertLines: { color: "#18181b" }, horzLines: { color: "#18181b" } },
      crosshair: { mode: 0 },
      timeScale: { borderColor: "#27272a", barSpacing: 8 },
      rightPriceScale: { borderColor: "#27272a" },
      width: chartContainerRef.current.clientWidth,
      height: 380,
    });
    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981", downColor: "#ef4444", borderVisible: false, wickUpColor: "#10b981", wickDownColor: "#ef4444"
    });
    candlestickSeries.setData(historicalData);

    const indicatorSeriesReferences: ISeriesApi<any>[] = [];
    activeIndicators.forEach((indicator) => {
      if (indicator.type === "MA") {
        const lineSeries = chart.addSeries(LineSeries, { color: indicator.color, lineWidth: 2, title: indicator.name });
        lineSeries.setData(indicator.calculate(historicalData));
        indicatorSeriesReferences.push(lineSeries);
      }
    });

    chart.timeScale().fitContent();
    setIsLoading(false);

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.removeSeries(candlestickSeries);
        indicatorSeriesReferences.forEach((series) => chartRef.current?.removeSeries(series));
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [isOpen, ticker, activeIndicators]);

  const handleGateClick = (reason: string) => {
    setGateReason(reason);
    setShowGatePrompt(true);
  };

  const handleCloseModal = () => {
    setShowGatePrompt(false);
    onClose();
  };

  return (
    <Dialog onOpenChange={(open) => !open && handleCloseModal()} open={isOpen}>
      <DialogContent className="max-w-4xl bg-zinc-950 border-zinc-800 text-zinc-100 shadow-2xl p-6 overflow-hidden">
        {/* Header Section */}
        <DialogHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <DialogTitle className="text-xl font-bold text-zinc-50">{ticker}</DialogTitle>
              <Badge className="bg-zinc-900 border-zinc-800 text-zinc-400" variant="outline">{exchange}</Badge>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {!isLoading && (
              <div className="flex items-center space-x-4 bg-zinc-900/40 border border-zinc-900 px-3 py-1.5 rounded-lg">
                <span className="text-sm font-mono text-zinc-200">₹{metaMetrics.price.toFixed(2)}</span>
                <span className={`text-sm font-mono ${metaMetrics.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                  {metaMetrics.change >= 0 ? "+" : ""}{metaMetrics.change.toFixed(2)}%
                </span>
              </div>
            )}
            
            {/* Deploy to Live Trading Terminal button */}
            <button
              onClick={() => {
                window.location.href = '/auth/signup?source=deployment';
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold px-3.5 py-1.5 rounded-lg text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5 cursor-pointer"
            >
              <Zap size={13} className="fill-current" />
              Deploy to Live Terminal
            </button>
          </div>
        </DialogHeader>

        {/* Dynamic Canvas Area */}
        <div className="relative mt-4 bg-zinc-950 rounded-xl border border-zinc-900 p-2 min-h-[380px] flex items-center justify-center">
          {isLoading && <Loader2 className="w-8 h-8 animate-spin text-zinc-500"/>}
          <div ref={chartContainerRef} className="w-full h-full" />

          {/* Prompt Registration Interceptor Dim Overlay */}
          {showGatePrompt && (
            <div className="absolute inset-0 bg-[#09090B]/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
              <div className="max-w-md bg-[#0D0D11] border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Lock size={20} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white">Unlock Advanced Analytics</h3>
                  <p className="text-xs text-gray-400 leading-normal">
                    Create a free account to {gateReason} and access institutional-grade execution feeds.
                  </p>
                </div>
                <button
                  onClick={() => {
                    window.location.href = `/auth/signup?source=gate&reason=${encodeURIComponent(gateReason)}`;
                  }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90 text-white font-extrabold py-2.5 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Create Free Account <ArrowRight size={13} />
                </button>
                <button
                  onClick={() => setShowGatePrompt(false)}
                  className="text-gray-500 hover:text-white text-[11px] font-bold block mx-auto"
                >
                  Go Back
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls layout */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-zinc-900 pt-4 gap-4">
          {/* Timeframe Selectors */}
          <div className="flex bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg">
            <button
              onClick={() => setActiveTimeframe("1d")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                activeTimeframe === "1d" ? "bg-zinc-800 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              1D View
            </button>
            <button
              onClick={() => handleGateClick("unlock granular intraday 15-minute timeframe charts")}
              className="px-3 py-1 text-xs font-bold text-gray-500 hover:text-gray-300 flex items-center gap-1"
            >
              15M <Lock size={10} />
            </button>
            <button
              onClick={() => handleGateClick("access high-frequency 1-minute orderbook streams")}
              className="px-3 py-1 text-xs font-bold text-gray-500 hover:text-gray-300 flex items-center gap-1"
            >
              1M <Lock size={10} />
            </button>
          </div>

          {/* Action Trigger */}
          <button
            onClick={() => handleGateClick("run extensive 5-year historical backtests on this instrument")}
            className="flex items-center gap-1.5 border border-zinc-800 bg-[#161B22]/40 hover:bg-zinc-900/60 text-gray-300 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            <Activity size={12} className="text-cyan-400" />
            Backtest 5-Year Structural Performance
            <Lock size={11} className="text-gray-500 ml-0.5" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
