"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle2, TrendingUp, ShieldCheck, Zap, LineChart, Cpu, DollarSign } from "lucide-react";

const STEPS = [
  { id: "experience", title: "Trading Experience", required: true },
  { id: "style", title: "Execution Paradigm", required: false },
  { id: "intent", title: "Primary Objective", required: false },
  { id: "capital", title: "Initial Capital Allocation", required: false },
  { id: "broker", title: "Brokerage Link", required: false },
];

export default function Wizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>({});
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      const { data: profile } = await supabase
        .from('users')
        .select('profile_wizard_step, preferences')
        .eq('id', user.id)
        .single();
        
      if (profile) {
        setCurrentStep(profile.profile_wizard_step || 0);
        if (profile.profile_wizard_step >= 5) {
          router.push('/dashboard');
        }
        setData(profile.preferences || {});
      }
      setLoading(false);
    };
    fetchProgress();
  }, [supabase, router]);

  const handleNext = async (skip = false) => {
    const step = STEPS[currentStep];
    if (!step) return;
    if (!skip && step.required && !data[step.id]) return;

    setSaving(true);
    const nextStep = currentStep + 1;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('users').update({
        profile_wizard_step: nextStep,
        preferences: data
      }).eq('id', user.id);
    }

    if (nextStep >= STEPS.length) {
      router.push('/dashboard');
    } else {
      setCurrentStep(nextStep);
    }
    setSaving(false);
  };

  const handleSelect = (key: string, value: string) => setData({ ...data, [key]: value });

  const isContinueDisabled = () => {
    if (saving) return true;
    const step = STEPS[currentStep];
    if (!step) return true;
    if (step.required && !data[step.id]) return true;

    // Additional validation for Step 5 (Broker integration)
    if (currentStep === 4 && !data.broker_sandbox) {
      if (!data.broker_name) return true;
      const config = data.broker_config || {};
      if (data.broker_name === 'fyers') {
        if (!config.app_id || !config.app_secret) return true;
      }
      if (data.broker_name === 'zerodha') {
        if (!config.api_key || !config.api_secret) return true;
      }
      if (data.broker_name === 'angelone') {
        if (!config.api_key || !config.client_id || !config.mpin || !config.totp_secret) return true;
      }
    }
    return false;
  };

  if (loading) return null;

  return (
    <div className="w-full relative">
      {/* Visual background element inside the card */}
      <div className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] bg-[#388BFD]/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[100px] -left-[100px] w-[300px] h-[300px] bg-[#238636]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="bg-[#161B22]/80 backdrop-blur-xl border border-[#30363D] rounded-2xl shadow-2xl p-8 md:p-12 relative overflow-hidden min-h-[500px] flex flex-col justify-between">
        
        {/* Progress System */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              {STEPS.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === currentStep ? 'w-8 bg-[#388BFD] shadow-[0_0_10px_rgba(56,139,253,0.5)]' : 
                    idx < currentStep ? 'w-4 bg-[#238636]' : 'w-4 bg-[#30363D]'
                  }`} 
                />
              ))}
            </div>
            <span className="text-xs font-mono text-gray-500 tracking-wider">STEP 0{currentStep + 1} / 0{STEPS.length}</span>
          </div>

          <motion.div
            key={`title-${currentStep}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              {STEPS[currentStep]?.title}
            </h2>
            <p className="text-gray-400 text-sm">
              Tailor your engine configuration to match your risk profile and operational needs.
            </p>
          </motion.div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* STEP 1: EXPERIENCE */}
              {currentStep === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'Novice', icon: <TrendingUp size={24} />, desc: 'New to quantitative models' },
                    { id: 'Intermediate', icon: <LineChart size={24} />, desc: 'Familiar with algorithmic execution' },
                    { id: 'Quant', icon: <Cpu size={24} />, desc: 'Developing custom Alpha logic' }
                  ].map((level) => (
                    <button
                      key={level.id}
                      onClick={() => handleSelect('experience', level.id)}
                      className={`p-6 rounded-xl border transition-all text-left flex flex-col items-start gap-4 ${
                        data.experience === level.id
                          ? 'border-[#388BFD] bg-[#388BFD]/10 text-white shadow-[0_0_20px_rgba(56,139,253,0.15)] ring-1 ring-[#388BFD]'
                          : 'border-[#30363D] bg-[#0D1117]/50 text-gray-400 hover:bg-[#1C2128] hover:border-gray-600'
                      }`}
                    >
                      <div className={`p-3 rounded-lg ${data.experience === level.id ? 'bg-[#388BFD] text-white' : 'bg-[#21262D] text-gray-400'}`}>
                        {level.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white mb-1">{level.id}</h3>
                        <p className="text-xs leading-relaxed opacity-80">{level.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* STEP 2: STYLE */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['High-Frequency Scalping', 'Intraday Momentum', 'Swing Trades (Days)', 'Positional Holding'].map((style) => (
                    <button
                      key={style}
                      onClick={() => handleSelect('style', style)}
                      className={`p-5 rounded-xl border transition-all text-left group flex justify-between items-center ${
                        data.style === style
                          ? 'border-[#238636] bg-[#238636]/10 text-white'
                          : 'border-[#30363D] bg-[#0D1117]/50 text-gray-400 hover:bg-[#1C2128]'
                      }`}
                    >
                      <span className={`font-semibold ${data.style === style ? 'text-white' : 'text-gray-300'}`}>{style}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${data.style === style ? 'border-[#238636] bg-[#238636]' : 'border-[#30363D]'}`}>
                        {data.style === style && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* STEP 3: INTENT */}
              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'Alpha Generation', sub: 'Aggressive growth seeking high ROI' },
                    { title: 'Capital Preservation', sub: 'Low drawdown, steady compounding' },
                    { title: 'Portfolio Hedging', sub: 'Automated risk mitigation' },
                    { title: 'Statistical Arbitrage', sub: 'Market-neutral mean reversion' }
                  ].map((intent) => (
                    <button
                      key={intent.title}
                      onClick={() => handleSelect('intent', intent.title)}
                      className={`p-5 rounded-xl border transition-all text-left ${
                        data.intent === intent.title
                          ? 'border-[#D29922] bg-[#D29922]/10'
                          : 'border-[#30363D] bg-[#0D1117]/50 hover:bg-[#1C2128]'
                      }`}
                    >
                      <h3 className={`font-bold mb-1 ${data.intent === intent.title ? 'text-[#D29922]' : 'text-gray-300'}`}>{intent.title}</h3>
                      <p className={`text-xs ${data.intent === intent.title ? 'text-[#D29922]/80' : 'text-gray-500'}`}>{intent.sub}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* STEP 4: CAPITAL */}
              {currentStep === 3 && (
                <div className="space-y-8 max-w-lg mx-auto py-6">
                  <div className="bg-[#0D1117] border border-[#30363D] rounded-2xl p-8 text-center shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#58A6FF] to-transparent opacity-50" />
                    <DollarSign className="w-6 h-6 text-[#58A6FF] mx-auto mb-2 opacity-50" />
                    <div className="text-5xl font-black text-white tracking-tighter">
                      ₹ {parseInt(data.capital || "100000").toLocaleString('en-IN')}
                    </div>
                    <p className="text-gray-500 text-xs font-mono mt-2 tracking-widest">ESTIMATED DEPLOYMENT</p>
                  </div>
                  
                  <div className="px-4">
                    <input
                      type="range"
                      min="10000"
                      max="10000000"
                      step="10000"
                      value={data.capital || "100000"}
                      onChange={(e) => handleSelect('capital', e.target.value)}
                      className="w-full h-2 bg-[#30363D] rounded-lg appearance-none cursor-pointer accent-[#58A6FF]"
                    />
                    <div className="flex justify-between text-xs text-gray-500 font-mono mt-3">
                      <span>₹10K</span>
                      <span>₹1Cr+</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: BROKER */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-gray-300">Choose Broker Integration</span>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-1.5 px-3 rounded-lg transition-colors hover:bg-emerald-500/15">
                      <input 
                        type="checkbox" 
                        checked={data.broker_sandbox || false} 
                        onChange={(e) => setData({ ...data, broker_sandbox: e.target.checked })}
                        className="rounded bg-black border-[#30363D] accent-emerald-500 focus:ring-0 cursor-pointer" 
                      />
                      Enable Paper Trading Sandbox
                    </label>
                  </div>

                  {!data.broker_sandbox ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {[
                        { id: 'fyers', name: 'Fyers', desc: 'Direct API Integration' },
                        { id: 'zerodha', name: 'Zerodha Kite', desc: 'Kite Connect API' },
                        { id: 'angelone', name: 'Angel One', desc: 'SmartAPI Integration' }
                      ].map((broker) => (
                        <button
                          key={broker.id}
                          type="button"
                          onClick={() => setData({ ...data, broker_name: broker.id, broker_config: {} })}
                          className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-between h-24 ${
                            data.broker_name === broker.id
                              ? 'border-[#388BFD] bg-[#388BFD]/10 text-white shadow-[0_0_20px_rgba(56,139,253,0.1)] ring-1 ring-[#388BFD]'
                              : 'border-[#30363D] bg-[#0D1117]/50 text-gray-400 hover:bg-[#1C2128]'
                          }`}
                        >
                          <span className="font-bold text-white text-sm">{broker.name}</span>
                          <span className="text-[10px] opacity-75">{broker.desc}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gradient-to-b from-[#238636]/10 to-transparent border border-[#238636]/20 rounded-xl p-6 text-center">
                      <CheckCircle2 className="w-12 h-12 text-[#39D353] mx-auto mb-4" />
                      <h4 className="font-bold text-white mb-2">Sandbox Environment Active</h4>
                      <p className="text-xs text-gray-400 max-w-md mx-auto">
                        Live execution is simulated using virtual capital. You can skip broker configuration and immediately test strategy logic against historical and live market feeds.
                      </p>
                    </div>
                  )}

                  {!data.broker_sandbox && data.broker_name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#0D1117] border border-[#30363D] rounded-xl p-6 space-y-4"
                    >
                      <h4 className="font-bold text-xs text-[#58A6FF] uppercase tracking-wider mb-2">
                        {data.broker_name.toUpperCase()} API Config
                      </h4>

                      {data.broker_name === 'fyers' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-gray-400 font-bold block">Fyers App ID</label>
                            <input
                              type="text"
                              required
                              value={data.broker_config?.app_id || ""}
                              onChange={(e) => setData({
                                ...data,
                                broker_config: { ...data.broker_config, app_id: e.target.value }
                              })}
                              placeholder="e.g. LJQBMJDTMW-100"
                              className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#388BFD]"
                            />
                            <span className="text-[9px] text-gray-500 block">Get this from Fyers API Dashboard</span>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-gray-400 font-bold block">Fyers App Secret</label>
                            <input
                              type="password"
                              required
                              value={data.broker_config?.app_secret || ""}
                              onChange={(e) => setData({
                                ...data,
                                broker_config: { ...data.broker_config, app_secret: e.target.value }
                              })}
                              placeholder="••••••••••••"
                              className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#388BFD]"
                            />
                            <span className="text-[9px] text-gray-500 block">Provided under your App details</span>
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[11px] text-gray-400 font-bold block">Redirect URI</label>
                            <input
                              type="text"
                              required
                              value={data.broker_config?.redirect_uri || "http://127.0.0.1:8000/api/v1/fyers/callback"}
                              onChange={(e) => setData({
                                ...data,
                                broker_config: { ...data.broker_config, redirect_uri: e.target.value }
                              })}
                              className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#388BFD]"
                            />
                            <span className="text-[9px] text-gray-500 block">Must match the Redirect URI configured in your developer portal</span>
                          </div>
                        </div>
                      )}

                      {data.broker_name === 'zerodha' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-gray-400 font-bold block">Kite API Key</label>
                            <input
                              type="text"
                              required
                              value={data.broker_config?.api_key || ""}
                              onChange={(e) => setData({
                                ...data,
                                broker_config: { ...data.broker_config, api_key: e.target.value }
                              })}
                              placeholder="API Key"
                              className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#388BFD]"
                            />
                            <span className="text-[9px] text-gray-500 block">From Zerodha Kite Connect developer console</span>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-gray-400 font-bold block">Kite API Secret</label>
                            <input
                              type="password"
                              required
                              value={data.broker_config?.api_secret || ""}
                              onChange={(e) => setData({
                                ...data,
                                broker_config: { ...data.broker_config, api_secret: e.target.value }
                              })}
                              placeholder="••••••••••••"
                              className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#388BFD]"
                            />
                            <span className="text-[9px] text-gray-500 block">Keep this secret key secure</span>
                          </div>
                        </div>
                      )}

                      {data.broker_name === 'angelone' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-gray-400 font-bold block">SmartAPI Key</label>
                            <input
                              type="text"
                              required
                              value={data.broker_config?.api_key || ""}
                              onChange={(e) => setData({
                                ...data,
                                broker_config: { ...data.broker_config, api_key: e.target.value }
                              })}
                              placeholder="SmartAPI Key"
                              className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#388BFD]"
                            />
                            <span className="text-[9px] text-gray-500 block">From SmartAPI dashboard</span>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-gray-400 font-bold block">Client ID</label>
                            <input
                              type="text"
                              required
                              value={data.broker_config?.client_id || ""}
                              onChange={(e) => setData({
                                ...data,
                                broker_config: { ...data.broker_config, client_id: e.target.value }
                              })}
                              placeholder="Client ID (e.g. A12345)"
                              className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#388BFD]"
                            />
                            <span className="text-[9px] text-gray-500 block">Your Angel One client code</span>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-gray-400 font-bold block">MPIN</label>
                            <input
                              type="password"
                              maxLength={6}
                              required
                              value={data.broker_config?.mpin || ""}
                              onChange={(e) => setData({
                                ...data,
                                broker_config: { ...data.broker_config, mpin: e.target.value }
                              })}
                              placeholder="e.g. 123456"
                              className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#388BFD]"
                            />
                            <span className="text-[9px] text-gray-500 block">Your 4-6 digit Angel login PIN</span>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-gray-400 font-bold block">TOTP Secret Key</label>
                            <input
                              type="password"
                              required
                              value={data.broker_config?.totp_secret || ""}
                              onChange={(e) => setData({
                                ...data,
                                broker_config: { ...data.broker_config, totp_secret: e.target.value }
                              })}
                              placeholder="TOTP Secret Key"
                              className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#388BFD]"
                            />
                            <span className="text-[9px] text-gray-500 block">Extracted during Google Authenticator setup</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#30363D]">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0 || saving}
            className="flex items-center text-gray-400 hover:text-white disabled:opacity-0 transition-colors font-medium text-sm py-2"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>
          
          <div className="flex items-center gap-4">
            {!STEPS[currentStep]?.required && (
              <button
                onClick={() => handleNext(true)}
                disabled={saving}
                className="text-gray-500 hover:text-gray-300 transition-colors text-sm font-medium"
              >
                Skip for now
              </button>
            )}
            
            <button
              onClick={() => handleNext()}
              disabled={isContinueDisabled()}
              className="flex items-center bg-[#238636] hover:bg-[#2ea043] text-white font-bold py-2.5 px-6 rounded-lg transition-all disabled:opacity-50 disabled:hover:bg-[#238636] shadow-lg text-sm"
            >
              {saving ? (
                "Processing..."
              ) : currentStep === STEPS.length - 1 ? (
                <>Launch Terminal <Zap className="w-4 h-4 ml-2" /></>
              ) : (
                <>Continue <ChevronRight className="w-4 h-4 ml-1" /></>
              )} 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
