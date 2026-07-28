"use client";

import React, { useEffect, useRef } from 'react';

export default function TradingViewTicker() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only load the script if it hasn't been loaded yet to prevent duplicates (e.g. React StrictMode)
    if (!containerRef.current || containerRef.current.querySelector('script')) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        {
          proName: "BSE:SENSEX",
          title: "SENSEX"
        },
        {
          proName: "BSE:RELIANCE",
          title: "RELIANCE"
        },
        {
          proName: "BSE:TCS",
          title: "TCS"
        },
        {
          proName: "BSE:HDFCBANK",
          title: "HDFCBANK"
        },
        {
          proName: "BSE:INFY",
          title: "INFY"
        },
        {
          proName: "BSE:SBIN",
          title: "SBI"
        }
      ],
      showSymbolLogo: true,
      colorTheme: "dark",
      isTransparent: true,
      displayMode: "regular",
      locale: "en"
    });

    containerRef.current.appendChild(script);

    return () => {
      // Clear contents on unmount
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="w-full bg-[#030712] border-y border-white/5 py-1">
      <div ref={containerRef} className="tradingview-widget-container">
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
}
