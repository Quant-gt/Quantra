"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, SkipForward, CheckCircle2 } from "lucide-react";

const STEPS = [
  { id: "experience", title: "Experience Level", required: true },
  { id: "style", title: "Trading Style", required: false },
  { id: "intent", title: "Primary Intent", required: false },
  { id: "capital", title: "Capital Range", required: false },
  { id: "broker", title: "Connect Broker", required: false },
];

export default function Wizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>({});
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Fetch current user and wizard progress
    const fetchProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      // Assuming profile table exists
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
    if (!skip && STEPS[currentStep].required && !data[STEPS[currentStep].id]) {
      return; // Required field missing
    }

    setSaving(true);
    const nextStep = currentStep + 1;
    
    // Save progress
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

  const handleSelect = (key: string, value: string) => {
    setData({ ...data, [key]: value });
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="glass-panel rounded-2xl shadow-2xl p-8 overflow-hidden relative min-h-[400px]">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="mb-8">
        <p className="text-sm font-medium text-primary mb-2">
          Step {currentStep + 1} of {STEPS.length}
        </p>
        <h2 className="text-2xl font-bold text-white">
          {STEPS[currentStep].title}
        </h2>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="min-h-[200px]"
        >
          {currentStep === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Beginner', 'Intermediate', 'Expert'].map((level) => (
                <button
                  key={level}
                  onClick={() => handleSelect('experience', level)}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    data.experience === level
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <h3 className="font-semibold text-lg">{level}</h3>
                  <p className="text-sm opacity-70 mt-1">
                    {level === 'Beginner' && 'Just starting with algos'}
                    {level === 'Intermediate' && 'Familiar with backtesting'}
                    {level === 'Expert' && 'Writing custom strategies'}
                  </p>
                </button>
              ))}
            </div>
          )}

          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Intraday', 'Swing', 'Positional', 'Scalping'].map((style) => (
                <button
                  key={style}
                  onClick={() => handleSelect('style', style)}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    data.style === style
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <h3 className="font-semibold">{style}</h3>
                </button>
              ))}
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Consistent Monthly Income', 'Wealth Creation', 'Learning/Experimentation', 'Hedging'].map((intent) => (
                <button
                  key={intent}
                  onClick={() => handleSelect('intent', intent)}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    data.intent === intent
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <h3 className="font-semibold">{intent}</h3>
                </button>
              ))}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4 max-w-md mx-auto">
              <input
                type="range"
                min="10000"
                max="5000000"
                step="10000"
                value={data.capital || "100000"}
                onChange={(e) => handleSelect('capital', e.target.value)}
                className="w-full accent-primary"
              />
              <div className="text-center text-3xl font-bold text-white">
                ₹{parseInt(data.capital || "100000").toLocaleString('en-IN')}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 inline-block">
                <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Connect Your Broker Later</h3>
                <p className="text-white/60 text-sm max-w-sm">
                  You can browse strategies and backtest without a broker. Connect one later to deploy live.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0 || saving}
          className="flex items-center text-white/60 hover:text-white disabled:opacity-30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Back
        </button>
        
        <div className="flex gap-3">
          {!STEPS[currentStep].required && (
            <button
              onClick={() => handleNext(true)}
              disabled={saving}
              className="flex items-center text-white/60 hover:text-white px-4 py-2 transition-colors"
            >
              Skip <SkipForward className="w-4 h-4 ml-2" />
            </button>
          )}
          
          <button
            onClick={() => handleNext()}
            disabled={saving || (STEPS[currentStep].required && !data[STEPS[currentStep].id])}
            className="flex items-center bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : currentStep === STEPS.length - 1 ? "Complete Setup" : "Continue"} 
            {!saving && <ChevronRight className="w-5 h-5 ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );
}
