"use client";

import { useState } from "react";
import { ArrowLeft, Search, Download } from "lucide-react";
import Link from "next/link";

export default function AuditLogExplorer() {
  const [logs, setLogs] = useState([
    { timestamp: "2026-05-11 15:30:00.123", event: "order_placed", symbol: "RELIANCE", action: "BUY", qty: 10, price: 2950.50, broker: "Zerodha", status: "SUCCESS", algo_id: "NSE-STRAT-123456" },
    { timestamp: "2026-05-11 15:31:12.456", event: "2fa_completed", symbol: "-", action: "-", qty: 0, price: 0, broker: "Upstox", status: "SUCCESS", algo_id: "-" },
    { timestamp: "2026-05-11 15:32:05.789", event: "ops_breach_throttle", symbol: "-", action: "PAUSE", qty: 0, price: 0, broker: "-", status: "ALERT", algo_id: "NSE-STRAT-654321" },
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <Link href="/compliance" className="text-white/50 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Audit Log Explorer</h1>
              <p className="text-white/60">
                Search and filter full 5-year compliance audit trails.
              </p>
            </div>
          </div>
          
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" /> Export for SEBI Inspection
          </button>
        </div>

        {/* Filters */}
        <div className="glass-panel p-6 rounded-xl border border-white/10 mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Search by Symbol, Algo-ID, or Event..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-primary/50"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 text-sm">
              <option value="all">All Events</option>
              <option value="order_placed">Order Placed</option>
              <option value="2fa_completed">2FA Completed</option>
              <option value="ops_breach">OPS Breach</option>
            </select>
            <input
              type="date"
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 text-sm"
            />
          </div>
        </div>

        {/* Results Table */}
        <div className="glass-panel rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-left text-white">
            <thead className="text-xs text-white/50 uppercase bg-white/5">
              <tr>
                <th scope="col" className="px-6 py-4">Timestamp</th>
                <th scope="col" className="px-6 py-4">Event</th>
                <th scope="col" className="px-6 py-4">Symbol</th>
                <th scope="col" className="px-6 py-4">Action</th>
                <th scope="col" className="px-6 py-4">Qty</th>
                <th scope="col" className="px-6 py-4">Price</th>
                <th scope="col" className="px-6 py-4">Broker</th>
                <th scope="col" className="px-6 py-4">Algo-ID</th>
                <th scope="col" className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm">
                  <td className="px-6 py-4 font-mono text-white/70">{log.timestamp}</td>
                  <td className="px-6 py-4 font-semibold text-white">{log.event}</td>
                  <td className="px-6 py-4 text-white/80">{log.symbol}</td>
                  <td className="px-6 py-4">{log.action}</td>
                  <td className="px-6 py-4">{log.qty || "-"}</td>
                  <td className="px-6 py-4">{log.price ? `₹${log.price}` : "-"}</td>
                  <td className="px-6 py-4 text-white/60">{log.broker}</td>
                  <td className="px-6 py-4 font-mono text-xs text-white/50">{log.algo_id}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      log.status === 'SUCCESS' ? 'border-green-500/30 bg-green-500/10 text-green-400' : 
                      log.status === 'ALERT' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-red-500/30 bg-red-500/10 text-red-400'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
