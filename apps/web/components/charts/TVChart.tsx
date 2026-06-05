"use client";

import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

interface TVChartProps {
  symbol: string;
}

export default function TVChart({ symbol }: TVChartProps) {
  const containerId = 'tv_chart_container';
  const isScriptLoaded = useRef(false);

  useEffect(() => {
    const initWidget = () => {
      if (typeof window.TradingView !== 'undefined') {
        new window.TradingView.widget({
          autosize: true,
          symbol: `BSE:${symbol}`, // Typically Indian stocks use BSE/NSE prefixes on TradingView
          interval: "D",
          timezone: "Asia/Kolkata",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          backgroundColor: "#0D1117",
          gridColor: "#30363D",
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: containerId,
          toolbar_bg: "#161B22",
          studies: [], // Load without initial studies to keep it clean, user can add them
          disabled_features: [
            "header_symbol_search", // We have our own symbol search
          ]
        });
      }
    };

    if (!isScriptLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://s.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        isScriptLoaded.current = true;
        initWidget();
      };
      document.head.appendChild(script);
      
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    } else {
      initWidget();
    }
  }, [symbol]);

  return (
    <div className="w-full h-full relative" id={containerId}>
      {/* Container for the TradingView Widget */}
    </div>
  );
}
