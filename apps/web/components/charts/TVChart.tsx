"use client";

import React, { useEffect, useRef, memo } from 'react';

function TVChart({ symbol }: { symbol: string }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    
    // Clear container to prevent duplicate widgets on re-renders
    container.current.innerHTML = '';
    
    const script = document.createElement("script");
    script.src = "https://s.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    
    // Append the ".NS" or "BSE:" prefix conditionally depending on whether it has it already
    const tvSymbol = symbol.includes(":") || symbol.includes(".") ? symbol : `BSE:${symbol}`;

    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "${tvSymbol}",
        "interval": "D",
        "timezone": "Asia/Kolkata",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "backgroundColor": "#0D1117",
        "gridColor": "#30363D",
        "hide_top_toolbar": false,
        "hide_legend": false,
        "save_image": false,
        "allow_symbol_change": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      }`;
      
    container.current.appendChild(script);
    
    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <div className="w-full h-full min-h-[400px] relative" ref={container}>
      <div className="tradingview-widget-container__widget w-full h-full"></div>
    </div>
  );
}

export default memo(TVChart);
