"use client";

import { useEffect, useRef } from 'react';
import { createChart, ColorType, ISeriesApi, Time, CandlestickSeries } from 'lightweight-charts';
import { feed, Tick } from '@/lib/engine/feed';

interface TVChartProps {
  symbol: string;
}

export default function TVChart({ symbol }: TVChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 1. Initialize Chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#8b949e',
      },
      grid: {
        vertLines: { color: 'rgba(48, 54, 61, 0.5)' },
        horzLines: { color: 'rgba(48, 54, 61, 0.5)' },
      },
      crosshair: {
        mode: 1, // Normal crosshair
        vertLine: { color: '#8b949e', style: 3, labelBackgroundColor: '#161B22' },
        horzLine: { color: '#8b949e', style: 3, labelBackgroundColor: '#161B22' },
      },
      rightPriceScale: {
        borderColor: '#30363D',
      },
      timeScale: {
        borderColor: '#30363D',
        timeVisible: true,
        secondsVisible: true,
      },
      autoSize: true,
    });

    chartRef.current = chart;

    // 2. Create Candlestick Series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#39D353',
      downColor: '#F85149',
      borderVisible: false,
      wickUpColor: '#39D353',
      wickDownColor: '#F85149',
    });
    candlestickSeriesRef.current = candlestickSeries;

    // 3. Generate Mock Historical Data (Intraday 1-minute candles)
    const initialData = [];
    let currentTime = Math.floor(Date.now() / 1000) - (60 * 100); // 100 minutes ago
    // Round to nearest minute
    currentTime = currentTime - (currentTime % 60);

    let currentPrice = symbol === 'RELIANCE' ? 2500 : 22500;
    
    for (let i = 0; i < 100; i++) {
      const volatility = currentPrice * 0.002;
      const open = currentPrice + (Math.random() - 0.5) * volatility;
      const close = open + (Math.random() - 0.5) * volatility;
      const high = Math.max(open, close) + Math.random() * (volatility / 2);
      const low = Math.min(open, close) - Math.random() * (volatility / 2);

      initialData.push({
        time: (currentTime + (i * 60)) as Time,
        open,
        high,
        low,
        close
      });
      currentPrice = close;
    }

    candlestickSeries.setData(initialData);

    // 4. Subscribe to Real-Time Feed (WebSockets)
    let lastCandle = { ...initialData[initialData.length - 1] };

    const handleTick = (tick: Tick) => {
      if (tick.symbol !== symbol) return;

      const now = Math.floor(Date.now() / 1000);
      const currentMinuteNum = now - (now % 60);

      if (currentMinuteNum > (lastCandle.time as number)) {
        // Start a new candle for the new minute
        lastCandle = {
          time: currentMinuteNum as Time,
          open: tick.price,
          high: tick.price,
          low: tick.price,
          close: tick.price
        };
      } else {
        // Update existing candle with live price
        lastCandle.close = tick.price;
        lastCandle.high = Math.max(lastCandle.high as number, tick.price);
        lastCandle.low = Math.min(lastCandle.low as number, tick.price);
      }

      // Instruct TradingView chart to visually "tick" the last candle
      candlestickSeries.update(lastCandle as any);
    };

    const unsubscribe = feed.subscribe(handleTick);

    // Cleanup
    return () => {
      unsubscribe();
      chart.remove();
    };
  }, [symbol]);

  return (
    <div className="w-full h-full relative" ref={chartContainerRef}>
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
        <img src="/logo_transparent.png" alt="Quantra" className="w-1/2 grayscale" />
      </div>
    </div>
  );
}
