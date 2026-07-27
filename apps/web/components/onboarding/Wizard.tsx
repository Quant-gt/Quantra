"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Zap } from "lucide-react";
import { StepExperience } from "./steps/StepExperience";
import { StepStyle } from "./steps/StepStyle";
import { StepIntent } from "./steps/StepIntent";
import { StepCapital } from "./steps/StepCapital";
import { StepBroker } from "./steps/StepBroker";

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
      try {
        const res = await fetch('/api/v1/onboarding/load');
        if (res.status === 401) {
          router.push('/auth');
          return;
        }
        if (res.ok) {
          const profile = await res.json();
          setCurrentStep(profile.profile_wizard_step || 0);
          if (profile.profile_wizard_step >= 5) {
            router.push('/dashboard');
          }
          setData(profile.preferences || {});
        }
      } catch (err) {
        console.error("Failed to load onboarding progress:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [router]);

  const handleNext = async (skip = false) => {
    const step = STEPS[currentStep];
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
          data
        })
      });

      if (!res.ok) {
        throw new Error('Failed to save progress');
      }

      if (nextStep >= STEPS.length) {
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
              {currentStep === 0 && <StepExperience data={data} handleSelect={handleSelect} />}
              {currentStep === 1 && <StepStyle data={data} handleSelect={handleSelect} />}
              {currentStep === 2 && <StepIntent data={data} handleSelect={handleSelect} />}
              {currentStep === 3 && <StepCapital data={data} handleSelect={handleSelect} />}
              {currentStep === 4 && <StepBroker data={data} setData={setData} />}
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
