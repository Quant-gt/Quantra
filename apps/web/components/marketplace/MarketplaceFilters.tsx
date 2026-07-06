"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/lib/hooks/useDebounce"; // We'll need to create this

export default function MarketplaceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    classification: searchParams.get("classification") || "all",
    minCagr: Number(searchParams.get("minCagr")) || 0,
    maxDd: Number(searchParams.get("maxDd")) || 100,
    minCapital: Number(searchParams.get("minCapital")) || 0,
  });

  const debouncedFilters = useDebounce(filters, 300);

  useEffect(() => {
    // Only update URL if filters actually changed from initial state
    const currentParams = new URLSearchParams(searchParams.toString());
    
    if (debouncedFilters.classification !== "all") {
      currentParams.set("classification", debouncedFilters.classification);
    } else {
      currentParams.delete("classification");
    }

    if (debouncedFilters.minCagr > 0) currentParams.set("minCagr", debouncedFilters.minCagr.toString());
    else currentParams.delete("minCagr");

    if (debouncedFilters.maxDd < 100) currentParams.set("maxDd", debouncedFilters.maxDd.toString());
    else currentParams.delete("maxDd");

    if (debouncedFilters.minCapital > 0) currentParams.set("minCapital", debouncedFilters.minCapital.toString());
    else currentParams.delete("minCapital");

    const newQuery = currentParams.toString();
    const queryStr = newQuery ? `?${newQuery}` : "";
    
    // Using window.history to avoid unnecessary Next.js re-renders during slide
    window.history.replaceState(null, '', `/marketplace${queryStr}`);
    
    // Also store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem("marketplace_filters", JSON.stringify(debouncedFilters));
    }
  }, [debouncedFilters, searchParams]);

  useEffect(() => {
    // Restore from localStorage on first mount if no URL params
    if (typeof window !== 'undefined' && !searchParams.toString()) {
      const saved = localStorage.getItem("marketplace_filters");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setFilters(parsed);
        } catch (e) {}
      }
    }
  }, []);

  const handleChange = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const activeCount = Object.values(filters).filter(v => v !== "all" && v !== 0 && v !== 100).length;

  return (
    <div className="glass-panel p-5 rounded-xl border border-white/10 sticky top-24">
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <h3 className="font-bold text-white flex items-center">
          Filters
          {activeCount > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </h3>
        {activeCount > 0 && (
          <button 
            onClick={() => setFilters({ classification: "all", minCagr: 0, maxDd: 100, minCapital: 0 })}
            className="text-xs text-white/50 hover:text-white"
          >
            Reset
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-white/80 block mb-2">Classification</label>
          <div className="space-y-2">
            {["all", "white_box", "black_box"].map(type => (
              <label key={type} className="flex items-center space-x-2 text-sm text-white/70 cursor-pointer">
                <input
                  type="radio"
                  name="classification"
                  checked={filters.classification === type}
                  onChange={() => handleChange("classification", type)}
                  className="accent-primary"
                />
                <span className="capitalize">{type.replace("_", " ")}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-white/80 flex justify-between mb-2">
            <span>Min CAGR</span>
            <span className="text-primary">{filters.minCagr}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="150"
            value={filters.minCagr}
            onChange={(e) => handleChange("minCagr", parseInt(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-white/80 flex justify-between mb-2">
            <span>Max Drawdown</span>
            <span className="text-red-400">{filters.maxDd}%</span>
          </label>
          <input
            type="range"
            min="5"
            max="100"
            value={filters.maxDd}
            onChange={(e) => handleChange("maxDd", parseInt(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-white/80 flex justify-between mb-2">
            <span>Max Capital Req.</span>
            <span className="text-white">₹{filters.minCapital.toLocaleString()}</span>
          </label>
          <input
            type="range"
            min="0"
            max="5000000"
            step="10000"
            value={filters.minCapital}
            onChange={(e) => handleChange("minCapital", parseInt(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>
    </div>
  );
}
