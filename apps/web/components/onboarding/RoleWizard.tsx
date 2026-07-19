"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle2, User, Code, Briefcase, Zap, Search } from "lucide-react";

type RoleType = "user" | "creator" | null;

const INVESTOR_STEPS = [
  { id: "experience_level", title: "Trading Experience", required: true },
  { id: "intent", title: "Primary Objective", required: false },
  { id: "capital", title: "Initial Capital Allocation", required: false },
  { id: "broker", title: "Brokerage Link", required: false },
];

const CREATOR_STEPS = [
  { id: "preferred_language", title: "Preferred Dev Style", required: true },
  { id: "intent", title: "Creator Intent", required: false },
  { id: "data_res", title: "Required Data Resolution", required: false },
];

export default function RoleWizard() {
  const [role, setRole] = useState<RoleType>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>({});
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch('/api/v1/onboarding/load');
        if (res.status === 401) {
          router.push('/auth');
          return;
        }
        if (res.ok) {
          const profile = await res.json();
          // If they already finished wizard, redirect
          if (profile.profile_wizard_step >= 5) {
            router.push('/dashboard');
          }
          setData({
            ...profile.preferences,
            roles: profile.roles || [],
            current_view: profile.current_view || 'user',
            experience_level: profile.experience_level || '',
            preferred_language: profile.preferred_language || ''
          });
          
          if (profile.current_view) {
            setRole(profile.current_view as RoleType);
            setCurrentStep(profile.profile_wizard_step || 0);
          }
        }
      } catch (err) {
        console.error("Failed to load onboarding progress:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [router]);

  const activeSteps = role === 'creator' ? CREATOR_STEPS : INVESTOR_STEPS;

  const handleNext = async (skip = false) => {
    if (role === null) return;
    const step = activeSteps[currentStep];
    if (!step) return;
    if (!skip && step.required && !data[step.id]) return;

    setSaving(true);
    const nextStep = currentStep + 1;
    
    try {
      const res = await fetch('/api/v1/onboarding/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentStep: nextStep,
          data: {
            ...data,
            roles: role === 'creator' ? ['user', 'creator'] : ['user'],
            current_view: role
          }
        })
      });

      if (!res.ok) throw new Error('Failed to save progress');

      if (nextStep >= activeSteps.length) {
        router.push('/dashboard');
      } else {
        setCurrentStep(nextStep);
      }
    } catch (err) {
      console.error("Failed to save onboarding step:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSelectRole = (selectedRole: RoleType) => {
    setRole(selectedRole);
    setData((prev: any) => ({
        ...prev,
        current_view: selectedRole,
        roles: selectedRole === 'creator' ? ['user', 'creator'] : ['user']
    }));
  };

  const handleSelect = (key: string, value: string) => setData({ ...data, [key]: value });

  if (loading) {
    return <div className="text-gray-500 animate-pulse text-center">Loading Initialization...</div>;
  }

  // --- Role Selection Split View ---
  if (role === null) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <h2 className="text-3xl font-bold text-white text-center mb-8">How will you use SigmaSpire?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            onClick={() => handleSelectRole('user')}
            className="bg-[#111827] border border-white/10 rounded-2xl p-8 cursor-pointer hover:border-emerald-500/50 hover:bg-[#111827]/80 transition-all group"
          >
            <div className="bg-emerald-500/10 w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Briefcase className="text-emerald-400" size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Investor / Trader</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              I want to discover profitable strategies, run backtests, rent algorithms, and deploy them to my broker.
            </p>
            <ul className="text-xs text-gray-500 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Plug-and-play strategies</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Automated execution</li>
            </ul>
          </div>
          
          <div 
            onClick={() => handleSelectRole('creator')}
            className="bg-[#111827] border border-white/10 rounded-2xl p-8 cursor-pointer hover:border-purple-500/50 hover:bg-[#111827]/80 transition-all group"
          >
            <div className="bg-purple-500/10 w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Code className="text-purple-400" size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Developer / Creator</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              I want to build complex algorithms using the visual IDE or Python, run deep simulations, and monetize them.
            </p>
            <ul className="text-xs text-gray-500 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-purple-500" /> Visual Logic Builder</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-purple-500" /> Storefront Monetization</li>
            </ul>
          </div>
        </div>
      </motion.div>
    );
  }

  // --- Dynamic Questionnaire View ---
  const step = activeSteps[currentStep];
  if (!step) return null;

  return (
    <div className="bg-[#111827] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
        <motion.div 
          className="h-full bg-gradient-to-r from-emerald-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep) / activeSteps.length) * 100}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center mb-8">
         <span className="text-xs font-bold text-gray-500 tracking-wider uppercase">
           Step {currentStep + 1} of {activeSteps.length}
         </span>
         <button onClick={() => setRole(null)} className="text-xs text-gray-500 hover:text-white flex items-center gap-1">
           <ChevronLeft size={14} /> Change Role
         </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="min-h-[300px]"
        >
          <h2 className="text-2xl font-bold text-white mb-6">{step.title}</h2>
          
          {step.id === 'experience_level' && (
            <div className="space-y-3">
              {['Beginner (Just starting)', 'Intermediate (Traded options/stocks)', 'Advanced (Used algos before)'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelect('experience_level', opt)}
                  className={`w-full text-left p-4 rounded-xl border ${data.experience_level === opt ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 bg-white/5 hover:border-white/20'} transition-all`}
                >
                  <span className="text-sm font-medium text-white">{opt}</span>
                </button>
              ))}
            </div>
          )}

          {step.id === 'preferred_language' && (
            <div className="space-y-3">
              {['Visual No-Code Builder', 'Python (Imports)', 'REST API Integrations'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelect('preferred_language', opt)}
                  className={`w-full text-left p-4 rounded-xl border ${data.preferred_language === opt ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 bg-white/5 hover:border-white/20'} transition-all`}
                >
                  <span className="text-sm font-medium text-white">{opt}</span>
                </button>
              ))}
            </div>
          )}

          {step.id === 'intent' && (
            <div className="space-y-3">
              {role === 'creator' ? 
                ['Private Use Only', 'Publish to Marketplace', 'Open-source Community'].map((opt) => (
                  <button key={opt} onClick={() => handleSelect('intent', opt)} className={`w-full text-left p-4 rounded-xl border ${data.intent === opt ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 bg-white/5'} transition-all`}><span className="text-sm font-medium text-white">{opt}</span></button>
                ))
              :
                ['Consistent Returns', 'Hedging Portfolio', 'Learning Algo Trading'].map((opt) => (
                  <button key={opt} onClick={() => handleSelect('intent', opt)} className={`w-full text-left p-4 rounded-xl border ${data.intent === opt ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 bg-white/5'} transition-all`}><span className="text-sm font-medium text-white">{opt}</span></button>
                ))
              }
            </div>
          )}

          {step.id === 'capital' && (
            <div className="space-y-3">
              {['< ₹1 Lakh', '₹1 - 5 Lakhs', '₹5 - 10 Lakhs', '> ₹10 Lakhs'].map((opt) => (
                  <button key={opt} onClick={() => handleSelect('capital', opt)} className={`w-full text-left p-4 rounded-xl border ${data.capital === opt ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 bg-white/5'} transition-all`}><span className="text-sm font-medium text-white">{opt}</span></button>
              ))}
            </div>
          )}
          
          {step.id === 'data_res' && (
            <div className="space-y-3">
              {['End of Day (EOD)', '1-Minute Candles', 'Tick-Level (High Frequency)'].map((opt) => (
                  <button key={opt} onClick={() => handleSelect('data_res', opt)} className={`w-full text-left p-4 rounded-xl border ${data.data_res === opt ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 bg-white/5'} transition-all`}><span className="text-sm font-medium text-white">{opt}</span></button>
              ))}
            </div>
          )}

          {step.id === 'broker' && (
            <div className="p-4 border border-white/5 bg-white/5 rounded-xl">
              <p className="text-gray-400 text-sm mb-4">You can set up your broker later in the dashboard. For now, you can skip this step or use the Sandbox.</p>
              <button onClick={() => handleSelect('broker_sandbox', 'true')} className={`w-full text-left p-4 rounded-xl border ${data.broker_sandbox ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 bg-[#0D1117]'} transition-all`}>
                <span className="text-sm font-bold text-white flex items-center gap-2"><Zap size={16} className="text-emerald-400" /> Start in Sandbox Mode (Simulated Paper Trading)</span>
              </button>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex justify-between items-center border-t border-white/10 pt-6">
        <button
          onClick={() => !step.required && handleNext(true)}
          className={`text-xs font-bold text-gray-500 hover:text-white transition-colors ${step.required ? 'opacity-0 pointer-events-none' : ''}`}
        >
          SKIP THIS STEP
        </button>

        <button
          onClick={() => handleNext(false)}
          disabled={saving || (step.required && !data[step.id])}
          className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? 'SAVING...' : 'CONTINUE'} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
