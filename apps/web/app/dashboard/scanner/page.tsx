"use client";

import { useState } from "react";
import { Play, Download, Share2, Search, SlidersHorizontal, LayoutGrid, Save } from "lucide-react";
import dynamic from 'next/dynamic';

const ScannerBuilder = dynamic(() => import("@/components/scanner/ScannerBuilder"), {
  ssr: false,
  loading: () => <div className="p-8 text-white/50 text-center">Loading Scanner Builder...</div>
});

export default function DashboardScannerPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([
    { ticker: "RELIANCE", name: "Reliance Industries", cmp: 2540.15, change: 1.2, matched: ["RSI Oversold", "Volume Spike"], sector: "Energy" },
    { ticker: "TCS", name: "Tata Consultancy Services", cmp: 3210.45, change: -0.5, matched: ["RSI Oversold"], sector: "IT" },
    { ticker: "INFY", name: "Infosys Limited", cmp: 1420.30, change: 2.1, matched: ["Volume Spike"], sector: "IT" },
  ]);

  const runScan = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="p-4 md:p-8 bg-[#0D1117] min-h-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-[#58A6FF]/10 rounded-lg">
              <Search className="text-[#58A6FF]" size={28} />
            </div>
            Visual Stock Scanner
          </h1>
          <p className="text-gray-400 text-sm mt-2 max-w-xl leading-relaxed">
            Construct complex technical and fundamental filter logic using a drag-and-drop node interface. Execute against the Nifty 500 universe in real-time.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 text-sm shadow-sm">
            <Save size={16} className="text-gray-400" /> Save Config
          </button>
          <button
            onClick={runScan}
            disabled={loading}
            className="bg-[#238636] hover:bg-[#2ea043] text-white font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2 text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <Play size={16} fill="currentColor" />
            )}
            {loading ? "EXECUTING..." : "RUN SCAN"}
          </button>
        </div>
      </div>

      {/* Builder Canvas Area */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl shadow-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#30363D] bg-[#0D1117] flex justify-between items-center">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <SlidersHorizontal size={16} className="text-[#58A6FF]" />
            Filter Logic Graph
          </div>
          <div className="text-xs font-mono text-gray-500 bg-[#21262D] px-2 py-1 rounded border border-[#30363D]">
            Universe: NIFTY 500
          </div>
        </div>
        
        {/* Render React Flow component here */}
        <div className="w-full">
          <ScannerBuilder />
        </div>
      </div>

      {results.length > 0 ? (
        <div className="bg-[#161B22]/80 backdrop-blur-xl border border-[#30363D] rounded-xl shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-[#30363D] bg-[#0D1117]/80 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 rounded-full bg-[#39D353] shadow-[0_0_8px_rgba(57,211,83,0.8)]"></span>
              <span className="text-white font-bold text-sm tracking-wide">{results.length} STOCKS MATCHED</span>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-gray-400 hover:text-white hover:bg-[#30363D] rounded-lg transition-colors border border-transparent hover:border-[#30363D]">
                <Download size={16} />
              </button>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-[#30363D] rounded-lg transition-colors border border-transparent hover:border-[#30363D]">
                <Share2 size={16} />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-white text-sm whitespace-nowrap">
              <thead className="text-xs text-gray-400 uppercase bg-[#0D1117]/50 border-b border-[#30363D]">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Ticker</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Company Name</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Sector</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-right">CMP</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-right">Day Change</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Matched Criteria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363D]/50">
                {results.map((stock) => (
                  <tr key={stock.ticker} className="hover:bg-[#1C2128]/80 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-bold text-[#58A6FF] group-hover:text-[#79C0FF] transition-colors cursor-pointer">
                        {stock.ticker}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300 font-medium">{stock.name}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2.5 py-1 bg-[#21262D] rounded-full text-gray-400 border border-[#30363D]">
                        {stock.sector}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-right">₹{stock.cmp.toFixed(2)}</td>
                    <td className={`px-6 py-4 font-mono font-bold text-right ${stock.change >= 0 ? 'text-[#39D353]' : 'text-[#F85149]'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change}%
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {stock.matched.map((tag: string) => (
                          <span key={tag} className="text-[10px] uppercase font-bold tracking-wider bg-[#238636]/10 text-[#39D353] px-2 py-1 rounded border border-[#238636]/30">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-16 text-center border border-[#30363D] bg-[#161B22]/50 backdrop-blur-sm rounded-xl shadow-inner">
          <div className="w-16 h-16 bg-[#21262D] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-[#30363D]">
            <Search size={24} className="text-[#58A6FF]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 tracking-tight">No active scan results</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto leading-relaxed">
            Configure your technical and fundamental parameters in the graph above and execute the scan across the Nifty 500 universe.
          </p>
        </div>
      )}
    </div>
  );
}

