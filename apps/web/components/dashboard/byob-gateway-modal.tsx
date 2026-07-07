"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lock, ShieldCheck, Key, CheckCircle2, AlertCircle, Info, Zap, Terminal } from "lucide-react";

interface BYOBGatewayModalProps {
  onSuccess: () => void;
}

export function BYOBGatewayModal({ onSuccess }: BYOBGatewayModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"angelone" | "dhan" | "fyers" | "shoonya" | "sandbox">("angelone");
  
  // Form configs
  const [angelOneConfig, setAngelOneConfig] = useState({ apiKey: "", clientId: "", mpin: "", totpSecret: "" });
  const [dhanConfig, setDhanConfig] = useState({ clientId: "", accessToken: "" });
  const [fyersConfig, setFyersConfig] = useState({ appId: "", secretKey: "", redirectUri: "http://127.0.0.1:8000/api/v1/fyers/callback" });
  const [shoonyaConfig, setShoonyaConfig] = useState({ vendorCode: "", userId: "", password: "", apiKey: "" });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if broker credentials exist in client browser memory
    const brokerName = localStorage.getItem("quantra_broker_name");
    const isSandbox = localStorage.getItem("quantra_broker_sandbox") === "true";
    
    if (!brokerName && !isSandbox) {
      setIsOpen(true);
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (activeTab === "sandbox") {
        localStorage.setItem("quantra_broker_sandbox", "true");
        localStorage.removeItem("quantra_broker_name");
        localStorage.removeItem("quantra_broker_config");
      } else {
        localStorage.setItem("quantra_broker_sandbox", "false");
        localStorage.setItem("quantra_broker_name", activeTab);
        
        let configData = {};
        if (activeTab === "angelone") {
          if (!angelOneConfig.apiKey || !angelOneConfig.clientId || !angelOneConfig.mpin || !angelOneConfig.totpSecret) {
            throw new Error("All Angel One configuration fields are required.");
          }
          configData = angelOneConfig;
        } else if (activeTab === "dhan") {
          if (!dhanConfig.clientId || !dhanConfig.accessToken) {
            throw new Error("All Dhan configuration fields are required.");
          }
          configData = dhanConfig;
        } else if (activeTab === "fyers") {
          if (!fyersConfig.appId || !fyersConfig.secretKey || !fyersConfig.redirectUri) {
            throw new Error("All Fyers configuration fields are required.");
          }
          configData = fyersConfig;
        } else if (activeTab === "shoonya") {
          if (!shoonyaConfig.vendorCode || !shoonyaConfig.userId || !shoonyaConfig.password || !shoonyaConfig.apiKey) {
            throw new Error("All Shoonya configuration fields are required.");
          }
          configData = shoonyaConfig;
        }
        
        localStorage.setItem("quantra_broker_config", JSON.stringify(configData));
      }

      // Notify host and close modal
      setIsOpen(false);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to configure broker keys.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-2xl bg-zinc-950 border border-zinc-900 text-zinc-100 shadow-2xl p-8 rounded-2xl [&>button]:hidden"
      >
        <DialogHeader className="space-y-3 pb-4 border-b border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <ShieldCheck size={22} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-zinc-50 tracking-tight">Bring Your Own Broker (BYOB) Setup</DialogTitle>
              <p className="text-xs text-zinc-500 mt-1">
                Link your active Indian retail broker API credentials. Private keys are encrypted and isolated client-side inside your browser storage.
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Info Banner */}
        <div className="mt-4 flex gap-3 p-3.5 bg-zinc-900/40 border border-zinc-900/60 rounded-xl text-[11px] text-zinc-400 leading-relaxed">
          <Info size={16} className="text-emerald-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-zinc-200">Non-Custodial Security Policy:</strong> All API keys, client codes, and tokens are stored directly in your browser's local memory. Quantra platform servers never receive, store, or log these credentials, ensuring strict regulatory compliance.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="mt-6 flex flex-wrap gap-1.5 p-1 bg-zinc-900/50 border border-zinc-900 rounded-xl">
          {[
            { id: "angelone", label: "Angel One" },
            { id: "dhan", label: "Dhan" },
            { id: "fyers", label: "Fyers" },
            { id: "shoonya", label: "Shoonya" },
            { id: "sandbox", label: "Paper Trading" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setError("");
              }}
              className={`flex-1 min-w-[90px] py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === tab.id
                  ? tab.id === "sandbox"
                    ? "bg-cyan-500 text-gray-950 shadow-md font-bold"
                    : "bg-emerald-500 text-gray-950 shadow-md font-bold"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSave} className="mt-6 space-y-5">
          {error && (
            <div className="flex gap-2 p-3 bg-red-950/20 border border-red-900/30 text-red-400 rounded-xl text-xs items-center">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields corresponding to Tab */}
          {activeTab === "angelone" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] text-zinc-400 font-bold block uppercase tracking-wider">SmartAPI Key</label>
                <input
                  type="text"
                  required
                  value={angelOneConfig.apiKey}
                  onChange={(e) => setAngelOneConfig({ ...angelOneConfig, apiKey: e.target.value })}
                  placeholder="SmartAPI Key"
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 animate-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-zinc-400 font-bold block uppercase tracking-wider">Client ID</label>
                <input
                  type="text"
                  required
                  value={angelOneConfig.clientId}
                  onChange={(e) => setAngelOneConfig({ ...angelOneConfig, clientId: e.target.value })}
                  placeholder="Client ID (e.g. S12345)"
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 animate-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-zinc-400 font-bold block uppercase tracking-wider">MPIN</label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={angelOneConfig.mpin}
                  onChange={(e) => setAngelOneConfig({ ...angelOneConfig, mpin: e.target.value })}
                  placeholder="Your Login MPIN"
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 animate-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-zinc-400 font-bold block uppercase tracking-wider">TOTP Secret Key</label>
                <input
                  type="password"
                  required
                  value={angelOneConfig.totpSecret}
                  onChange={(e) => setAngelOneConfig({ ...angelOneConfig, totpSecret: e.target.value })}
                  placeholder="TOTP Secret Key"
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 animate-none"
                />
              </div>
            </div>
          )}

          {activeTab === "dhan" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] text-zinc-400 font-bold block uppercase tracking-wider">Client ID</label>
                <input
                  type="text"
                  required
                  value={dhanConfig.clientId}
                  onChange={(e) => setDhanConfig({ ...dhanConfig, clientId: e.target.value })}
                  placeholder="Dhan Client ID"
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 animate-none"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] text-zinc-400 font-bold block uppercase tracking-wider">Access Token (Dhan HQ API)</label>
                <input
                  type="password"
                  required
                  value={dhanConfig.accessToken}
                  onChange={(e) => setDhanConfig({ ...dhanConfig, accessToken: e.target.value })}
                  placeholder="Dhan Access Token"
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 animate-none"
                />
              </div>
            </div>
          )}

          {activeTab === "fyers" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] text-zinc-400 font-bold block uppercase tracking-wider">App ID</label>
                <input
                  type="text"
                  required
                  value={fyersConfig.appId}
                  onChange={(e) => setFyersConfig({ ...fyersConfig, appId: e.target.value })}
                  placeholder="Fyers App ID"
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 animate-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-zinc-400 font-bold block uppercase tracking-wider">Secret Key</label>
                <input
                  type="password"
                  required
                  value={fyersConfig.secretKey}
                  onChange={(e) => setFyersConfig({ ...fyersConfig, secretKey: e.target.value })}
                  placeholder="App Secret Key"
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 animate-none"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] text-zinc-400 font-bold block uppercase tracking-wider">Redirect URI</label>
                <input
                  type="text"
                  required
                  value={fyersConfig.redirectUri}
                  onChange={(e) => setFyersConfig({ ...fyersConfig, redirectUri: e.target.value })}
                  placeholder="http://127.0.0.1:8000/api/v1/fyers/callback"
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 animate-none"
                />
              </div>
            </div>
          )}

          {activeTab === "shoonya" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] text-zinc-400 font-bold block uppercase tracking-wider">Vendor Code</label>
                <input
                  type="text"
                  required
                  value={shoonyaConfig.vendorCode}
                  onChange={(e) => setShoonyaConfig({ ...shoonyaConfig, vendorCode: e.target.value })}
                  placeholder="Shoonya Vendor Code"
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 animate-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-zinc-400 font-bold block uppercase tracking-wider">User ID</label>
                <input
                  type="text"
                  required
                  value={shoonyaConfig.userId}
                  onChange={(e) => setShoonyaConfig({ ...shoonyaConfig, userId: e.target.value })}
                  placeholder="Broker User ID"
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 animate-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-zinc-400 font-bold block uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  required
                  value={shoonyaConfig.password}
                  onChange={(e) => setShoonyaConfig({ ...shoonyaConfig, password: e.target.value })}
                  placeholder="Your Login Password"
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 animate-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-zinc-400 font-bold block uppercase tracking-wider">Shoonya API Key</label>
                <input
                  type="password"
                  required
                  value={shoonyaConfig.apiKey}
                  onChange={(e) => setShoonyaConfig({ ...shoonyaConfig, apiKey: e.target.value })}
                  placeholder="Shoonya Developer API Key"
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 animate-none"
                />
              </div>
            </div>
          )}

          {activeTab === "sandbox" && (
            <div className="bg-zinc-900/30 border border-zinc-900/80 rounded-xl p-5 text-center space-y-3 animate-none">
              <CheckCircle2 className="w-10 h-10 text-cyan-400 mx-auto" />
              <h4 className="font-bold text-zinc-200 text-sm">Paper Trading Sandbox Mode</h4>
              <p className="text-[11px] text-zinc-500 max-w-sm mx-auto leading-relaxed">
                Test scanner logic, sentence builders, and charting components without linking any live brokerage accounts. Simulates order fulfillment inside safe browser environment sandbox.
              </p>
            </div>
          )}

          {/* Action Trigger */}
          <button
            type="submit"
            disabled={saving}
            className={`w-full py-3.5 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg ${
              activeTab === "sandbox"
                ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-cyan-500/10 font-bold"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-950 shadow-emerald-500/10 font-bold"
            }`}
          >
            {saving ? (
              "Verifying Configurations..."
            ) : (
              <>
                <Zap size={14} className={activeTab === "sandbox" ? "text-white" : "text-gray-950"} />
                {activeTab === "sandbox" ? "Activate Sandbox Terminal" : "Link Active Broker & Launch Terminal"}
              </>
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
