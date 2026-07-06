"use client";
import { toast } from "sonner";
import React, { useState, useEffect } from 'react';
import { Terminal, Play, Server, Activity } from 'lucide-react';
import { createClient } from "@/lib/supabase/client";

export default function EngineTerminal() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeStrategyId, setActiveStrategyId] = useState<string | null>(null);
  const supabase = createClient();

  // Load an active strategy for diagnostic webhook tests
  useEffect(() => {
    const fetchActiveStrategy = async () => {
      try {
        const { data } = await supabase
          .from('strategies')
          .select('id')
          .limit(1);
        if (data && data[0]) {
          setActiveStrategyId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load active strategy for diagnostics:", err);
      }
    };
    fetchActiveStrategy();
  }, [supabase]);

  // Poll logs every second
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/v1/engine/webhook');
        const data = await res.json();
        setLogs(data.logs || []);
      } catch (err) {
        // ignore polling errors
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerTestSignal = async () => {
    if (!activeStrategyId) {
      toast.error("No active strategies found in database. Please register/seed strategies first.");
      return;
    }
    
    setLoading(true);
    try {
      await fetch('/api/v1/engine/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategyId: activeStrategyId,
          action: 'BUY',
          asset: 'NIFTY_BANK_CE_48000'
        })
      });
    } catch (err) {
      toast.error("Failed to send test signal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col bg-[#0B0F19]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Server className="text-yellow-500" />
            Engine Diagnostics
          </h1>
          <p className="text-sm text-gray-400 mt-1">Live monitoring of the Broker API Fan-Out Engine.</p>
        </div>
        <button 
          onClick={triggerTestSignal}
          disabled={loading}
          className="bg-yellow-600/20 border border-yellow-600/50 hover:bg-yellow-600 hover:text-white text-yellow-500 px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-lg flex items-center gap-2"
        >
          {loading ? <Activity size={16} className="animate-spin" /> : <Play size={16} />}
          Fire Test Webhook Signal
        </button>
      </div>

      <div className="flex-1 bg-[#05080f] border border-[#30363D] rounded-xl overflow-hidden flex flex-col font-mono shadow-2xl relative">
        <div className="bg-[#161B22] border-b border-[#30363D] px-4 py-2 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-sans font-medium uppercase tracking-widest">
            <Terminal size={14} />
            stdout: qcore-fanout-01
          </div>
          <div className="flex items-center gap-2 text-xs text-[#39D353]">
            <div className="w-2 h-2 rounded-full bg-[#39D353] animate-pulse"></div>
            SYSTEM ONLINE
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-2">
          {logs.length === 0 ? (
            <div className="text-gray-600 text-sm italic">Waiting for incoming webhook signals...</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="text-sm text-green-400/90 break-words flex gap-3 leading-relaxed">
                <span className="text-gray-500 shrink-0 select-none">~</span>
                <span>{renderLogLine(log)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Safely parses terminal logs and injects styling nodes without dangerouslySetInnerHTML
function renderLogLine(log: string) {
  const regex = /(\[FANOUT\]|\[ZERODHA\]|\[UPSTOX\]|ERROR|SKIPPING|ROUTING)/g;
  const parts = log.split(regex);
  
  return parts.map((part, index) => {
    if (part === '[FANOUT]') {
      return <span key={index} className="text-blue-400">[FANOUT]</span>;
    }
    if (part === '[ZERODHA]') {
      return <span key={index} className="text-orange-400 font-bold">[ZERODHA]</span>;
    }
    if (part === '[UPSTOX]') {
      return <span key={index} className="text-purple-400 font-bold">[UPSTOX]</span>;
    }
    if (part === 'ERROR') {
      return <span key={index} className="text-red-500 font-bold">ERROR</span>;
    }
    if (part === 'SKIPPING') {
      return <span key={index} className="text-gray-400">SKIPPING</span>;
    }
    if (part === 'ROUTING') {
      return <span key={index} className="text-cyan-400">ROUTING</span>;
    }
    return part;
  });
}


