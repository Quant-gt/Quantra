"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BarChart3, TrendingDown, TrendingUp } from "lucide-react";

type StockData = {
  ticker: string;
  name: string;
  price: string;
  change: string;
  pe: string;
  up: boolean;
  isUpdating?: boolean; // Used for CSS pulse effect
};

const INITIAL_STOCKS: StockData[] = [
  { ticker: "RELIANCE", name: "Reliance Industries Ltd.", price: "₹1,327.20", change: "-10.11%", pe: "21.9x", up: false },
  { ticker: "TCS", name: "Tata Consultancy Services Ltd.", price: "₹2,269.00", change: "-29.30%", pe: "51.4x", up: false },
  { ticker: "HDFCBANK", name: "HDFC Bank Ltd.", price: "₹819.60", change: "-17.50%", pe: "47.5x", up: false },
  { ticker: "INFY", name: "Infosys Ltd.", price: "₹1,896.50", change: "-30.75%", pe: "37.0x", up: false },
  { ticker: "SBIN", name: "State Bank of India", price: "₹1,044.30", change: "+25.97%", pe: "27.0x", up: true },
];

export default function LiveMarketTable() {
  const [stocks, setStocks] = useState<StockData[]>(INITIAL_STOCKS);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_AI_ENGINE_URL || "http://127.0.0.1:8000";
    const eventSource = new EventSource(`${backendUrl}/api/v1/market/stream`);

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.stocks) {
          setStocks((currentStocks) => {
            const updated = [...currentStocks];
            let hasChanges = false;

            data.stocks.forEach((liveStock: any) => {
              const idx = updated.findIndex((s) => s.ticker === liveStock.name);
              if (idx !== -1) {
                const oldStock = updated[idx];
                const newPrice = `₹${liveStock.price}`;
                
                // Only update if price or change percentage actually changed
                if (oldStock && (oldStock.price !== newPrice || oldStock.change !== liveStock.change)) {
                  updated[idx] = {
                    ...oldStock,
                    price: newPrice,
                    change: liveStock.change,
                    up: liveStock.up,
                    isUpdating: true,
                  };
                  hasChanges = true;
                } else if (oldStock) {
                  updated[idx] = { ...(oldStock as StockData), isUpdating: false };
                }
              }
            });

            return hasChanges ? updated : currentStocks;
          });
        }
      } catch (err) {
        console.error("Error parsing live market data:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn("Live market stream disconnected, falling back to static data.");
      setIsConnected(false);
      eventSource.close(); // Stop retrying to avoid spamming the backend if it's down
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Remove the isUpdating flag after animation plays (500ms)
  useEffect(() => {
    const updatingStocks = stocks.some((s) => s.isUpdating);
    if (updatingStocks) {
      const timer = setTimeout(() => {
        setStocks((current) => current.map((s) => ({ ...s, isUpdating: false })));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stocks]);

  return (
    <div className="overflow-x-auto relative mt-6 border border-[#30363D]/50 rounded-xl bg-[#0D1117] shadow-xl">
      {!isConnected && (
        <div className="absolute top-3 right-4 flex items-center gap-2 text-[10px] text-[#8B949E] font-medium z-10 bg-[#161B22] px-2 py-1 rounded-full border border-[#30363D]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#8B949E]"></div>
          OFFLINE (STATIC DATA)
        </div>
      )}
      {isConnected && (
        <div className="absolute top-3 right-4 flex items-center gap-2 text-[10px] text-[#10B981] font-bold z-10 bg-[#10B981]/10 px-2 py-1 rounded-full border border-[#10B981]/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></div>
          LIVE (FYERS STREAM)
        </div>
      )}

      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-[#30363D] bg-[#161B22]/50">
            <th className="py-4 px-8 text-xs font-semibold text-[#8B949E] uppercase tracking-wider">ASSET TICKER</th>
            <th className="py-4 px-8 text-xs font-semibold text-[#8B949E] uppercase tracking-wider text-right">LAST TRADED PRICE</th>
            <th className="py-4 px-8 text-xs font-semibold text-[#8B949E] uppercase tracking-wider text-right">1D PRICE ACTION</th>
            <th className="py-4 px-8 text-xs font-semibold text-[#8B949E] uppercase tracking-wider text-right">CURRENT P/E</th>
            <th className="py-4 px-8 text-xs font-semibold text-[#8B949E] uppercase tracking-wider text-right">DIAGNOSTIC ACTION</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#30363D]/50 text-sm font-medium relative">
          {stocks.map((stock) => (
            <tr 
              key={stock.ticker} 
              className={`transition-colors duration-500 ease-out ${
                stock.isUpdating 
                  ? stock.up ? "bg-[#10B981]/20" : "bg-[#F43F5E]/20"
                  : "bg-transparent hover:bg-[#161B22]"
              }`}
            >
              <td className="py-5 px-8 flex items-center gap-2">
                <span className="text-white font-bold">{stock.ticker}</span>
                <span className="text-[#8B949E] text-xs">({stock.name})</span>
                <BarChart3 className={`w-3 h-3 ${stock.up ? "text-[#10B981]" : "text-[#F43F5E]"}`} />
              </td>
              <td className={`py-5 px-8 text-right font-bold transition-colors duration-300 ${stock.isUpdating ? "text-white" : "text-gray-300"}`}>
                {stock.price}
              </td>
              <td className={`py-5 px-8 text-right flex justify-end items-center gap-1 ${stock.up ? "text-[#10B981]" : "text-[#F43F5E]"}`}>
                {stock.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stock.change}
              </td>
              <td className="py-5 px-8 text-right text-[#8B949E]">{stock.pe}</td>
              <td className="py-5 px-8 text-right">
                <Link href="/dashboard/builder" className="text-[#10B981] hover:text-[#34D399] transition-colors inline-flex items-center gap-1 font-bold text-xs">
                  Examine Canvas <ArrowUpRight className="w-3 h-3" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
