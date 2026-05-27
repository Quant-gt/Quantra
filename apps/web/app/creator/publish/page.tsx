"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Link as LinkIcon, Settings, DollarSign, Activity, Shield } from "lucide-react";
import Link from "next/link";

export default function PublishStrategy() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    classification: "white_box",
    minCapital: 50000,
    monthlyFee: 0,
    profitShare: 0,
  });

  const handlePublish = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/creator/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        alert("Strategy published successfully!");
        router.push('/creator');
      } else {
        alert("Failed to publish: " + data.error);
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/creator" className="text-gray-400 hover:text-white flex items-center gap-2 mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Publish New Strategy</h1>
          <p className="text-white/60">
            Configure your algorithm for the marketplace.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full z-0"></div>
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-500`} style={{ width: `${(step - 1) * 50}%` }}></div>
          
          <div className="w-full flex justify-between relative z-10">
            {[
              { num: 1, label: "Metadata", icon: <Settings size={18} /> },
              { num: 2, label: "Integration", icon: <LinkIcon size={18} /> },
              { num: 3, label: "Monetization", icon: <DollarSign size={18} /> }
            ].map(s => (
              <div key={s.num} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                  step >= s.num ? 'bg-primary text-white shadow-[0_0_15px_rgba(88,166,255,0.4)]' : 'bg-[#1C2128] text-gray-500 border border-white/10'
                }`}>
                  {step > s.num ? <CheckCircle2 size={20} /> : s.icon}
                </div>
                <span className={`text-xs font-semibold ${step >= s.num ? 'text-primary' : 'text-gray-500'}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-white mb-6">Strategy Details</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Strategy Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Nifty Options Scalper" 
                    className="w-full bg-[#0D1117] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe how your strategy works, its edge, and risk profile..." 
                    className="w-full bg-[#0D1117] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all h-32 resize-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Classification</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setFormData({...formData, classification: 'white_box'})}
                      className={`p-4 rounded-xl border text-left transition-all ${formData.classification === 'white_box' ? 'bg-primary/10 border-primary text-white' : 'bg-[#0D1117] border-white/10 text-gray-400 hover:border-white/30'}`}
                    >
                      <div className="font-bold mb-1">White Box</div>
                      <div className="text-xs opacity-70">Subscribers can see the underlying rules and exact parameters. Builds trust.</div>
                    </button>
                    <button 
                      onClick={() => setFormData({...formData, classification: 'black_box'})}
                      className={`p-4 rounded-xl border text-left transition-all ${formData.classification === 'black_box' ? 'bg-primary/10 border-primary text-white' : 'bg-[#0D1117] border-white/10 text-gray-400 hover:border-white/30'}`}
                    >
                      <div className="font-bold mb-1">Black Box</div>
                      <div className="text-xs opacity-70">Proprietary logic remains hidden. Only entry/exit signals are executed.</div>
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => setStep(2)}
                  disabled={!formData.name || !formData.description}
                  className="w-full mt-6 bg-white text-black hover:bg-gray-200 disabled:opacity-50 font-bold py-3 px-4 rounded-xl transition-colors"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-white mb-2">Logic Integration</h2>
              <p className="text-sm text-gray-400 mb-6">Connect your TradingView alerts or custom Python scripts to Quantra.</p>
              
              <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-6 mb-6">
                <h3 className="text-md font-bold text-white mb-4">Your Unique Webhook URL</h3>
                <div className="flex gap-2">
                  <input 
                    readOnly
                    value={`https://api.quantra.io/v1/wh/strat_${Math.random().toString(36).substr(2, 9)}`}
                    className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-4 py-2 text-green-400 font-mono text-sm focus:outline-none cursor-copy"
                  />
                  <button className="bg-[#21262D] hover:bg-[#30363D] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-[#30363D]">
                    Copy
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                  Paste this URL into your TradingView Alert settings. When your alert triggers, Quantra will automatically fan-out the execution to all your active subscribers in real-time.
                </p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3">
                <Shield className="text-yellow-500 shrink-0 w-5 h-5" />
                <p className="text-xs text-yellow-200/80 leading-relaxed">
                  <strong>Security Note:</strong> Do not share your Webhook URL. Anyone with this URL can trigger trades on behalf of your subscribers.
                </p>
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 bg-transparent hover:bg-white/5 text-white font-bold py-3 px-4 rounded-xl transition-colors border border-white/10"
                >
                  Back
                </button>
                <button 
                  onClick={() => setStep(3)}
                  className="flex-[2] bg-white text-black hover:bg-gray-200 font-bold py-3 px-4 rounded-xl transition-colors"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-white mb-6">Monetization</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Required Minimum Capital (₹)</label>
                  <input 
                    type="number" 
                    value={formData.minCapital}
                    onChange={(e) => setFormData({...formData, minCapital: Number(e.target.value)})}
                    className="w-full bg-[#0D1117] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">What is the minimum margin required to trade 1x multiplier?</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Monthly Fee (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                      <input 
                        type="number" 
                        value={formData.monthlyFee}
                        onChange={(e) => setFormData({...formData, monthlyFee: Number(e.target.value)})}
                        className="w-full bg-[#0D1117] border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-all font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Profit Share (%)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={formData.profitShare}
                        onChange={(e) => setFormData({...formData, profitShare: Number(e.target.value)})}
                        className="w-full bg-[#0D1117] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-all font-mono"
                        max="50"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#161B22] rounded-xl p-5 border border-[#30363D]">
                  <p className="text-sm font-bold text-white mb-2">Platform Fees</p>
                  <p className="text-xs text-gray-400 mb-1 flex justify-between"><span>Subscription Fee Cut:</span> <span>10%</span></p>
                  <p className="text-xs text-gray-400 flex justify-between"><span>Profit Share Cut:</span> <span>5%</span></p>
                </div>

                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={() => setStep(2)}
                    className="flex-1 bg-transparent hover:bg-white/5 text-white font-bold py-3 px-4 rounded-xl transition-colors border border-white/10"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handlePublish}
                    disabled={loading}
                    className="flex-[2] bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg"
                  >
                    {loading ? <Activity size={18} className="animate-spin" /> : <><CheckCircle2 size={18} /> Publish to Marketplace</>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
