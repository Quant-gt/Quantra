"use client";

import React, { memo, useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import { Loader2 } from 'lucide-react';

function TVChart({ symbol, interval = "D" }: { symbol: string, interval?: string }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    setLoading(true);
    setError(null);

    // 1. Calculate date range based on interval
    const today = new Date();
    const range_to = today.toISOString().split('T')[0];
    let range_from = '';

    if (interval === '1' || interval === '5' || interval === '15' || interval === '30') {
      const d = new Date();
      d.setDate(d.getDate() - 7); // Last 7 days
      range_from = d.toISOString().split('T')[0] || '';
    } else if (interval === '60') {
      const d = new Date();
      d.setDate(d.getDate() - 30); // Last 30 days
      range_from = d.toISOString().split('T')[0] || '';
    } else {
      const d = new Date();
      d.setFullYear(d.getFullYear() - 1); // Last 1 year
      range_from = d.toISOString().split('T')[0] || '';
    }

    let chart: IChartApi | null = null;
    let isMounted = true;

    // 2. Fetch history
    const fetchData = async () => {
      try {
        const url = `/api/v1/market/history?symbol=${encodeURIComponent(symbol)}&resolution=${interval}&range_from=${range_from}&range_to=${range_to}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }
        const data = await res.json();
        if (!isMounted) return;

        if (!data.candles || data.candles.length === 0) {
          setError("No historical data available for this timeframe.");
          setLoading(false);
          return;
        }

        // Format data for lightweight-charts
        // Ensure chronological order
        const formattedCandles = data.candles
          .map((c: any) => ({
            time: c.time,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
          }))
          .sort((a: any, b: any) => a.time - b.time);

        const formattedVolume = data.candles
          .map((c: any) => ({
            time: c.time,
            value: c.volume,
            color: c.close >= c.open ? 'rgba(38, 166, 154, 0.4)' : 'rgba(239, 83, 80, 0.4)',
          }))
          .sort((a: any, b: any) => a.time - b.time);

        setLoading(false);

        // 3. Initialize lightweight-chart
        if (!chartContainerRef.current) return;
        
        chart = createChart(chartContainerRef.current, {
          layout: {
            background: { type: ColorType.Solid, color: 'transparent' },
            textColor: '#8B949E',
          },
          grid: {
            vertLines: { color: 'rgba(48, 54, 61, 0.4)' },
            horzLines: { color: 'rgba(48, 54, 61, 0.4)' },
          },
          rightPriceScale: {
            borderColor: '#30363D',
          },
          timeScale: {
            borderColor: '#30363D',
            timeVisible: true,
            secondsVisible: false,
          },
          width: chartContainerRef.current.clientWidth,
          height: 450,
        });

        // Add candlestick series
        const mainSeries = chart.addSeries(CandlestickSeries, {
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
        });
        mainSeries.setData(formattedCandles);

        // Add volume series
        const volumeSeries = chart.addSeries(HistogramSeries, {
          priceFormat: {
            type: 'volume',
          },
          priceScaleId: '', // Set overlay mode
        });
        
        volumeSeries.priceScale().applyOptions({
          scaleMargins: {
            top: 0.8, // volume is at bottom 20%
            bottom: 0,
          },
        });
        volumeSeries.setData(formattedVolume);

        // Handle resizing
        const handleResize = () => {
          if (chart && chartContainerRef.current) {
            chart.resize(chartContainerRef.current.clientWidth, 450);
          }
        };
        window.addEventListener('resize', handleResize);

        // Cleanup resize listener
        return () => window.removeEventListener('resize', handleResize);

      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to load charting data.");
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      if (chart) {
        chart.remove();
      }
    };
  }, [symbol, interval]);

  return (
    <div className="w-full h-full min-h-[450px] relative bg-[#161B22]/40 rounded-xl overflow-hidden border border-[#30363D]/60">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0D1117]/80 backdrop-blur-sm z-10 gap-3">
          <Loader2 className="animate-spin text-[#388BFD]" size={36} />
          <span className="text-gray-400 text-xs font-medium font-mono">Fetching market candles...</span>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0D1117]/90 z-10 p-6 text-center">
          <div className="p-3 bg-red-500/10 rounded-full border border-red-500/20 mb-3">
            <span className="text-red-400 font-bold text-sm">⚠️ Connection Timeout</span>
          </div>
          <p className="text-gray-300 text-sm max-w-sm font-medium leading-relaxed">{error}</p>
          <span className="text-gray-500 text-[10px] mt-2 font-mono uppercase tracking-wider">Please ensure your broker keys are linked.</span>
        </div>
      )}

      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
}

export default memo(TVChart);
