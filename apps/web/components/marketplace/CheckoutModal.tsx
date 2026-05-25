"use client";

import { useState } from 'react';
import { X, Lock, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import { Strategy } from './StrategyCard';

interface CheckoutModalProps {
  strategy: Strategy | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ strategy, isOpen, onClose }: CheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !strategy) return null;

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/billing/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategyId: strategy.id })
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      } else {
        alert("Payment failed");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-[#0B0F19] border border-[#30363D] w-full max-w-xl rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {success ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Subscription Confirmed!</h2>
            <p className="text-gray-400">You are now subscribed to {strategy.name}.</p>
            <p className="text-gray-400 text-sm mt-2">Redirecting you to dashboard...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center p-6 border-b border-[#30363D] bg-[#161B22]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Lock size={20} className="text-[#58A6FF]" /> Secure Checkout
              </h2>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              {/* Strategy Details */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-[#21262D] rounded-xl border border-[#30363D] flex items-center justify-center shrink-0">
                  <Activity className="text-[#58A6FF]" size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{strategy.name}</h3>
                  <p className="text-sm text-gray-400">by {strategy.creator_name}</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">Institutional grade trading strategy.</p>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Monthly Access Fee</span>
                  <span className="text-white font-medium">₹{strategy.fee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Platform Convenience Fee</span>
                  <span className="text-white font-medium">₹0</span>
                </div>
                <div className="border-t border-[#30363D] pt-3 flex justify-between">
                  <span className="text-white font-bold">Total due today</span>
                  <span className="text-[#58A6FF] font-bold text-lg">₹{strategy.fee}</span>
                </div>
              </div>

              {/* Mock Credit Card */}
              <div>
                <h4 className="text-sm font-bold text-white mb-3">Payment Method</h4>
                <div className="bg-[#0B0F19] border border-[#30363D] rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-xs font-bold text-white">VISA</div>
                    <div>
                      <p className="text-sm font-medium text-white">•••• •••• •••• 4242</p>
                      <p className="text-xs text-gray-500">Expires 12/28</p>
                    </div>
                  </div>
                  <button className="text-xs text-[#58A6FF] font-medium hover:underline">Change</button>
                </div>
              </div>

              <button 
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2"><Activity size={18} className="animate-spin" /> Processing Payment...</span>
                ) : (
                  <>Subscribe Now (₹{strategy.fee})</>
                )}
              </button>

              <div className="flex justify-center items-center gap-2 text-xs text-gray-500">
                <ShieldCheck size={14} /> Payments are processed securely. Cancel anytime.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
