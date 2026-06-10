"use client";

import { useState } from "react";
import { Shield, CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ComplianceDashboard() {
  const [widgets, setWidgets] = useState([
    { id: 1, name: "Algo-ID Registry", status: "green", desc: "All active strategies have valid Algo-IDs." },
    { id: 2, name: "Static IP Status", status: "green", desc: "Whitelisted IP verified with broker." },
    { id: 3, name: "OPS Pulse Monitor", status: "amber", desc: "Approaching 8 OPS limit on Strategy X." },
    { id: 4, name: "Daily 2FA Health", status: "green", desc: "Morning 2FA completed successfully." },
    { id: 5, name: "RA License Badge", status: "red", desc: "License document missing or expired." },
    { id: 6, name: "Hosting Region", status: "green", desc: "Server located in India (Mumbai)." },
    { id: 7, name: "MPP Order Mode", status: "green", desc: "Market Price Protection enabled." },
    { id: 8, name: "Audit Log Health", status: "green", desc: "Syncing normally to secure storage." },
  ]);

  const hasRed = widgets.some(w => w.status === "red");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "green": return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "amber": return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      case "red": return <XCircle className="w-6 h-6 text-red-500" />;
      default: return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "green": return "border-green-500/20 bg-green-500/5";
      case "amber": return "border-amber-500/20 bg-amber-500/5";
      case "red": return "border-red-500/20 bg-red-500/5";
      default: return "border-white/10";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Global Alert Banner */}
      {hasRed && (
        <div className="bg-red-950 border-b border-red-800 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6" />
              <div>
                <p className="font-bold">1 Compliance Issue Detected</p>
                <p className="text-xs text-red-400/80">Your live strategies are paused until resolved.</p>
              </div>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors text-sm">
              Fix Now
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" /> SEBI Compliance Dashboard
            </h1>
            <p className="text-white/60">
              Real-time monitoring of regulatory requirements.
            </p>
          </div>
          
          <div className="flex gap-4">
            <Link href="/compliance/audit-log" className="bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-6 rounded-xl transition-colors border border-white/10 text-sm flex items-center gap-2">
              Audit Log Explorer
            </Link>
            <button className="text-white/50 hover:text-white p-3 rounded-lg transition-colors border border-white/10">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 8 Widgets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {widgets.map((widget) => (
            <div key={widget.id} className={`glass-panel p-6 rounded-xl border ${getStatusClass(widget.status)} transition-colors`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-white">{widget.name}</h3>
                {getStatusIcon(widget.status)}
              </div>
              <p className="text-sm text-white/60 mb-6">{widget.desc}</p>
              
              {widget.status !== "green" && (
                <button className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-colors ${
                  widget.status === 'red' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}>
                  Resolve Issue
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

