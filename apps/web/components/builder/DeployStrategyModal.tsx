"use client";

import { useState } from "react";
import { X, Rocket, ShieldAlert, Monitor, Banknote, ChevronDown, Zap } from "lucide-react";
import { toast } from "sonner";

interface DeployStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategyName?: string;
  sourceModule: "magic_scanner" | "block_builder" | "visual_canvas";
  strategyData: any;
}

export function DeployStrategyModal({
  isOpen,
  onClose,
  strategyName = "Unnamed Strategy",
  sourceModule,
  strategyData,
}: DeployStrategyModalProps) {
  const [executionMode, setExecutionMode] = useState<"paper" | "live">("paper");
  const [brokerageId, setBrokerageId] = useState("fyers_linked");
  const [capital, setCapital] = useState("10000");
  const [maxDrawdown, setMaxDrawdown] = useState("2");
  const [isDeploying, setIsDeploying] = useState(false);

  if (!isOpen) return null;

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const payload = {
        strategy_data: {
          source_module: sourceModule,
          raw_config: strategyData,
        },
        deployment_settings: {
          execution_mode: executionMode,
          brokerage_id: executionMode === "live" ? brokerageId : "sandbox",
          allocated_capital: parseFloat(capital),
          max_drawdown: parseFloat(maxDrawdown),
        },
      };

      const res = await fetch("/api/v1/strategies/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Deployment failed");

      toast.success(
        `Strategy successfully deployed to ${
          executionMode === "paper" ? "paper trading" : "live trading"
        }!`
      );
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to deploy strategy. Please try again.");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-[#161B22] border border-[#30363D] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#30363D] bg-[#0D1117]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Rocket size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight leading-tight">Quick Deploy</h2>
              <p className="text-xs text-gray-400 font-mono">{strategyName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white hover:bg-[#21262D] rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Execution Mode */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Execution Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setExecutionMode("paper")}
                className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-bold transition-all ${
                  executionMode === "paper" 
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                  : 'border-[#30363D] bg-[#0D1117] text-gray-400 hover:border-gray-500'
                }`}
              >
                <Monitor size={16} /> Paper Trading
              </button>
              <button
                onClick={() => setExecutionMode("live")}
                className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-bold transition-all ${
                  executionMode === "live" 
                  ? 'border-red-500/50 bg-red-500/10 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
                  : 'border-[#30363D] bg-[#0D1117] text-gray-400 hover:border-gray-500'
                }`}
              >
                <Zap size={16} /> Live Trade
              </button>
            </div>
          </div>

          {/* Brokerage Selection (Only for Live) */}
          {executionMode === "live" && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Integrated Brokerage</label>
              <div className="relative">
                <select 
                  value={brokerageId}
                  onChange={(e) => setBrokerageId(e.target.value)}
                  className="w-full appearance-none bg-[#0D1117] border border-[#30363D] rounded-lg p-3 pr-10 text-white text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="fyers_linked">Fyers (Linked - Active)</option>
                  <option value="zerodha_linked" disabled>Zerodha (Expired)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
              </div>
            </div>
          )}

          {/* Capital Allocation */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Capital Allocation (Base Currency)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Banknote className="text-gray-500" size={16} />
              </div>
              <input
                type="number"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg p-3 pl-10 text-white text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="10000"
              />
            </div>
          </div>

          {/* Risk Limits */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-yellow-500" /> Max Drawdown Limit (%)
            </label>
            <input
              type="number"
              value={maxDrawdown}
              onChange={(e) => setMaxDrawdown(e.target.value)}
              className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg p-3 text-white text-sm font-medium focus:outline-none focus:border-yellow-500 transition-colors"
              placeholder="2.0"
              step="0.1"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-[#30363D] bg-[#161B22] flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-bold text-gray-400 hover:text-white hover:bg-[#21262D] transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleDeploy}
            disabled={isDeploying}
            className="flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] text-white px-5 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
          >
            {isDeploying ? (
              <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Deploying...</>
            ) : (
              <><Rocket size={16} /> Confirm & Launch</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
