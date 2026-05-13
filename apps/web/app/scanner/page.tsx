"use client";

import { useState } from "react";
import { Play, Download, Share2 } from "lucide-react";

export default function ScannerPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const runScan = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/scanner/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filter_graph: {} }),
      });
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Nifty 500 Stock Scanner</h1>
            <p className="text-white/60">
              Scan all 500 stocks in real-time using custom filter criteria.
            </p>
          </div>
          
          <button
            onClick={runScan}
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2"
          >
            {loading ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <Play className="w-5 h-5" />
            )}
            {loading ? "Scanning..." : "Run Scan"}
          </button>
        </div>

        {results.length > 0 ? (
          <div className="glass-panel rounded-xl border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <span className="text-white font-semibold">{results.length} Stocks Matched</span>
              <div className="flex gap-2">
                <button className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <table className="w-full text-left text-white">
              <thead className="text-xs text-white/50 uppercase bg-white/5">
                <tr>
                  <th scope="col" className="px-6 py-4">Ticker</th>
                  <th scope="col" className="px-6 py-4">Name</th>
                  <th scope="col" className="px-6 py-4">CMP</th>
                  <th scope="col" className="px-6 py-4">Day Change</th>
                  <th scope="col" className="px-6 py-4">Matched Criteria</th>
                </tr>
              </thead>
              <tbody>
                {results.map((stock) => (
                  <tr key={stock.ticker} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-primary">{stock.ticker}</td>
                    <td className="px-6 py-4 text-white/80">{stock.name}</td>
                    <td className="px-6 py-4">₹{stock.cmp.toFixed(2)}</td>
                    <td className={`px-6 py-4 font-medium ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change}%
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {stock.matched.map((tag: string) => (
                          <span key={tag} className="text-xs bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
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
        ) : (
          <div className="p-16 text-center border border-white/10 glass-panel rounded-xl">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No active scan results</h3>
            <p className="text-white/50 mb-6">Click "Run Scan" to scan the Nifty 500 universe based on your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
