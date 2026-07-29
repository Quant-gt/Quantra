"use client";

import React, { useEffect, useState } from 'react';
import { TrendingDown, TrendingUp } from "lucide-react";

type StockData = {
  ticker: string;
  name: string;
  price: string;
  change: string;
  up: boolean;
};

const INITIAL_STOCKS: StockData[] = [
  { ticker: "RELIANCE", name: "Reliance Industries Ltd.", price: "₹1,327.20", change: "-10.11%", up: false },
  { ticker: "TCS", name: "Tata Consultancy Services Ltd.", price: "₹2,269.00", change: "-29.30%", up: false },
  { ticker: "HDFCBANK", name: "HDFC Bank Ltd.", price: "₹819.60", change: "-17.50%", up: false },
  { ticker: "INFY", name: "Infosys Ltd.", price: "₹1,896.50", change: "-30.75%", up: false },
  { ticker: "SBIN", name: "State Bank of India", price: "₹1,044.30", change: "+25.97%", up: true },
  { ticker: "ICICIBANK", name: "ICICI Bank Ltd.", price: "₹1,120.50", change: "+1.2%", up: true },
];

export default function TradingViewTicker() {
  const [stocks, setStocks] = useState<StockData[]>(INITIAL_STOCKS);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_AI_ENGINE_URL || "http://127.0.0.1:8000";
    const eventSource = new EventSource(`${backendUrl}/api/v1/market/stream`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.stocks) {
          setStocks((currentStocks) => {
            const updated = [...currentStocks];
            data.stocks.forEach((liveStock: any) => {
              const idx = updated.findIndex((s) => s.ticker === liveStock.name);
              const newPrice = `₹${liveStock.price}`;
              
              if (idx !== -1 && updated[idx]) {
                updated[idx] = { ...(updated[idx] as StockData), price: newPrice, change: liveStock.change, up: liveStock.up };
              } else {
                // If it's a new stock from the stream that isn't in INITIAL_STOCKS
                updated.push({
                  ticker: liveStock.name,
                  name: liveStock.name, // We don't have full name from stream, fallback to ticker
                  price: newPrice,
                  change: liveStock.change,
                  up: liveStock.up,
                });
              }
            });
            return updated;
          });
        }
      } catch (err) {
        console.error("Error parsing ticker data:", err);
      }
    };

    eventSource.onerror = () => {
      // Silently ignore and fallback to static data if stream drops
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // We duplicate the stocks array so the marquee loops seamlessly
  const tickerItems = [...stocks, ...stocks, ...stocks];

  return (
    <div className="w-full bg-[#030712] border-y border-white/5 py-1.5 overflow-hidden flex items-center">
      <div className="flex animate-marquee whitespace-nowrap">
        {tickerItems.map((stock, i) => (
          <div key={`${stock.ticker}-${i}`} className="flex items-center gap-3 px-6 border-r border-[#30363D]/50 last:border-none">
            <span className="text-[#E6EDF3] font-bold text-xs tracking-wide">{stock.ticker}</span>
            <span className="text-white font-medium text-xs">{stock.price}</span>
            <span className={`flex items-center gap-1 text-[11px] font-bold ${stock.up ? "text-[#10B981]" : "text-[#F43F5E]"}`}>
              {stock.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {stock.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
