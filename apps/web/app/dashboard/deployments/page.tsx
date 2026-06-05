"use client";`nimport { toast } from "sonner";

import { useState, useEffect } from "react";
import { AlertTriangle, Power, PowerOff, RefreshCw } from "lucide-react";

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<any[]>([
    { id: '1', name: 'Nifty Options Scalper', broker: 'Zerodha', mode: 'live', status: 'active', today_pnl: 2450.50, unrealised_pnl: 1200.00 },
    { id: '2', name: 'BankNifty Trend Follower', broker: 'Upstox', mode: 'paper', status: 'active', today_pnl: -450.00, unrealised_pnl: -150.00 },
    { id: '3', name: 'Crude Oil Breakout', broker: 'Angel One', mode: 'live', status: 'paused', today_pnl: 0.00, unrealised_pnl: 0.00 }
  ]);

  const [masterKillActive, setMasterKillActive] = useState(false);

  const handleKill = async (id: string) => {
    if (!confirm("Are you sure you want to kill this strategy? All positions will be squared off.")) return;
    
    // Simulate API call
    setDeployments(prev => prev.map(dep => 
      dep.id === id ? { ...dep, status: 'killed', today_pnl: dep.today_pnl + dep.unrealised_pnl, unrealised_pnl: 0 } : dep
    ));
    
    toast.info(`Strategy ${id} killed and positions squared off.`);
  };

  const handleMasterKill = async () => {
    const passphrase = prompt("To confirm Master Kill, type 'KILL ALL':");
    if (passphrase !== 'KILL ALL') {
      toast.info("Passphrase incorrect. Master Kill aborted.");
      return;
    }

    setMasterKillActive(true);
    
    // Simulate killing all
    setTimeout(() => {
      setDeployments(prev => prev.map(dep => ({
        ...dep,
        status: 'killed',
        today_pnl: dep.today_pnl + dep.unrealised_pnl,
        unrealised_pnl: 0
      })));
      setMasterKillActive(false);
      toast.success("MASTER KILL COMPLETE. All strategies stopped and positions squared off.");
    }, 2000);
  };

  const handleModeToggle = (id: string, currentMode: string) => {
    const newMode = currentMode === 'live' ? 'paper' : 'live';
    const confirmMsg = newMode === 'live' 
      ? "WARNING: You are switching to LIVE execution. Real capital will be used. Proceed?" 
      : "Switching to PAPER trading. Trades will be simulated.";
      
    if (confirm(confirmMsg)) {
      setDeployments(prev => prev.map(dep => 
        dep.id === id ? { ...dep, mode: newMode } : dep
      ));
    }
  };

  // Simulate real-time PnL ticking for active deployments
  useEffect(() => {
    const interval = setInterval(() => {
      setDeployments(prev => prev.map(dep => {
        if (dep.status === 'active') {
          // Add random jitter to unrealised PnL
          const jitter = (Math.random() - 0.5) * 50; 
          return { ...dep, unrealised_pnl: dep.unrealised_pnl + jitter };
        }
        return dep;
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Master Kill Banner */}
      <div className="bg-red-950 border-b border-red-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 text-red-400">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <p className="font-bold">Emergency Master Kill Switch</p>
              <p className="text-xs text-red-400/80">Stops all strategies and squares off all positions across all brokers instantly.</p>
            </div>
          </div>
          <button
            onClick={handleMasterKill}
            disabled={masterKillActive}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-lg shadow-red-900/50 disabled:opacity-50"
          >
            {masterKillActive ? "Executing..." : "KILL ALL"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">My Deployments</h1>
          <button className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {deployments.map((dep) => (
            <div key={dep.id} className={`glass-panel p-6 rounded-xl border ${dep.status === 'killed' ? 'border-red-500/20 bg-red-500/5' : 'border-white/10'}`}>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                {/* Info */}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-white">{dep.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      dep.mode === 'live' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                    }`}>
                      {dep.mode.toUpperCase()}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      dep.status === 'active' ? 'border-green-500/30 bg-green-500/10 text-green-400' : 
                      dep.status === 'killed' ? 'border-red-500/30 bg-red-500/10 text-red-400' : 'border-white/20 bg-white/5 text-white/50'
                    }`}>
                      {dep.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-white/50">Broker: {dep.broker}</p>
                </div>

                {/* P&L */}
                <div className="flex gap-8 text-center md:text-right">
                  <div>
                    <p className="text-xs text-white/50 mb-1">Today's P&L</p>
                    <p className={`text-xl font-bold ${dep.today_pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ₹{dep.today_pnl.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 mb-1">Unrealised P&L</p>
                    <p className={`text-xl font-bold ${dep.unrealised_pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ₹{dep.unrealised_pnl.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {dep.status !== 'killed' && (
                    <button
                      onClick={() => handleModeToggle(dep.id, dep.mode)}
                      className={`border p-3 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold ${
                        dep.mode === 'live' 
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' 
                        : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'
                      }`}
                      title="Toggle Execution Mode"
                    >
                      {dep.mode === 'live' ? 'Switch to Paper' : 'Switch to Live'}
                    </button>
                  )}
                  {dep.status === 'active' && (
                    <button
                      onClick={() => handleKill(dep.id)}
                      className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 p-3 rounded-lg transition-colors flex items-center gap-2"
                      title="Kill Strategy"
                    >
                      <Power className="w-5 h-5" /> <span className="font-semibold text-sm">Kill</span>
                    </button>
                  )}
                  {dep.status === 'paused' && (
                    <button className="bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white border border-green-500/30 p-3 rounded-lg transition-colors" title="Resume">
                      <Power className="w-5 h-5" />
                    </button>
                  )}
                  {dep.status === 'killed' && (
                    <button className="bg-white/5 text-white/30 border border-white/10 p-3 rounded-lg cursor-not-allowed" disabled title="Killed">
                      <PowerOff className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

