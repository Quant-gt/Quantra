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

const VALUE_STOCKS: StockData[] = [
  { ticker: "ONGC", name: "Oil & Natural Gas Corp.", price: "₹268.40", change: "+1.25%", pe: "8.5x", up: true },
  { ticker: "COALINDIA", name: "Coal India Ltd.", price: "₹425.10", change: "-0.45%", pe: "7.2x", up: false },
  { ticker: "SBIN", name: "State Bank of India", price: "₹812.30", change: "+2.15%", pe: "12.4x", up: true },
  { ticker: "RELIANCE", name: "Reliance Industries Ltd.", price: "₹1,327.20", change: "-10.11%", pe: "21.9x", up: false },
  { ticker: "ITC", name: "ITC Ltd.", price: "₹435.50", change: "+0.85%", pe: "18.2x", up: true },
];

const MOMENTUM_STOCKS: StockData[] = [
  { ticker: "TATASTEEL", name: "Tata Steel Ltd.", price: "₹164.20", change: "+3.85%", pe: "45.2x", up: true },
  { ticker: "BHARTIALRT", name: "Bharti Airtel Ltd.", price: "₹1,420.50", change: "+4.12%", pe: "65.3x", up: true },
  { ticker: "TATAMOTORS", name: "Tata Motors Ltd.", price: "₹945.10", change: "+2.95%", pe: "18.9x", up: true },
  { ticker: "HAL", name: "Hindustan Aeronautics Ltd.", price: "₹4,120.30", change: "+5.60%", pe: "38.2x", up: true },
  { ticker: "ADANIPORTS", name: "Adani Ports & SEZ Ltd.", price: "₹1,340.20", change: "+3.20%", pe: "32.1x", up: true },
];

const VOLUME_STOCKS: StockData[] = [
  { ticker: "SUZLON", name: "Suzlon Energy Ltd.", price: "₹56.96", change: "+9.85%", pe: "112.5x", up: true },
  { ticker: "IRFC", name: "Indian Railway Finance Corp.", price: "₹178.40", change: "+7.45%", pe: "34.2x", up: true },
  { ticker: "ZOMATO", name: "Zomato Ltd.", price: "₹198.20", change: "+5.12%", pe: "140.3x", up: true },
  { ticker: "HUDCO", name: "Housing & Urban Dev. Corp.", price: "₹245.50", change: "+8.90%", pe: "24.5x", up: true },
  { ticker: "YESBANK", name: "Yes Bank Ltd.", price: "₹24.80", change: "-1.20%", pe: "65.0x", up: false },
];

interface LiveMarketTableProps {
  activeTab: 'value' | 'momentum' | 'volume';
}

export default function LiveMarketTable({ activeTab }: LiveMarketTableProps) {
  const [stocks, setStocks] = useState<StockData[]>(VALUE_STOCKS);
  const [isConnected, setIsConnected] = useState(false);

  // Sync state when activeTab changes
  useEffect(() => {
    if (activeTab === 'value') {
      setStocks(VALUE_STOCKS);
    } else if (activeTab === 'momentum') {
      setStocks(MOMENTUM_STOCKS);
    } else {
      setStocks(VOLUME_STOCKS);
    }
  }, [activeTab]);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_AI_ENGINE_URL || "http://127.0.0.1:8000";
    const eventSource = new EventSource(`${backendUrl}/api/v1/market/stream?filter=${activeTab}`);

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
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [activeTab]);

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
