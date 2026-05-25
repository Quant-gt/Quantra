import React, { useState } from 'react';
import { X, Key, ShieldCheck, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BrokerConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (brokerName: string, appId: string) => void;
}

const BROKERS = [
  { id: 'zerodha', name: 'Zerodha Kite', color: 'bg-[#FF5722]' },
  { id: 'upstox', name: 'Upstox', color: 'bg-[#5024C2]' },
  { id: 'angelone', name: 'Angel One', color: 'bg-[#003B70]' },
  { id: 'icicidirect', name: 'ICICI Direct', color: 'bg-[#F26522]' },
  { id: 'fyers', name: 'Fyers', color: 'bg-[#1D2B4F]' },
  { id: 'aliceblue', name: 'Alice Blue', color: 'bg-[#2196F3]' },
  { id: 'shoonya', name: 'Shoonya', color: 'bg-[#000000]' },
  { id: 'dhan', name: 'Dhan', color: 'bg-[#181E25]' },
];

export default function BrokerConnectionModal({ isOpen, onClose, onSuccess }: BrokerConnectionModalProps) {
  const [step, setStep] = useState<'selection' | 'credentials' | 'connecting' | 'success'>('selection');
  const [selectedBroker, setSelectedBroker] = useState<typeof BROKERS[0] | null>(null);
  const [appId, setAppId] = useState('');

  if (!isOpen) return null;

  const handleSelectBroker = (broker: typeof BROKERS[0]) => {
    setSelectedBroker(broker);
    setStep('credentials');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('connecting');
    
    // Simulate API connection
    setTimeout(() => {
      setStep('success');
      
      // Keep success screen for 1.5 seconds, then close
      setTimeout(() => {
        onSuccess(selectedBroker!.name, appId || 'APP' + Math.floor(Math.random() * 100000));
        handleClose();
      }, 1500);
    }, 1500);
  };

  const handleClose = () => {
    setStep('selection');
    setSelectedBroker(null);
    setAppId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#161B22] border border-[#30363D] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#30363D] flex justify-between items-center bg-[#0D1117]">
          <div className="flex items-center gap-3">
            {step === 'credentials' && (
              <button 
                onClick={() => setStep('selection')}
                className="p-1.5 hover:bg-[#21262D] rounded-md transition-colors text-gray-400 hover:text-white"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-xl font-bold text-white">
              {step === 'selection' ? 'Select Your Broker' : 
               step === 'credentials' ? `Connect ${selectedBroker?.name}` :
               step === 'connecting' ? 'Connecting...' : 'Success!'}
            </h2>
          </div>
          {(step === 'selection' || step === 'credentials') && (
            <button 
              onClick={handleClose}
              className="p-1.5 hover:bg-[#F85149]/10 text-gray-400 hover:text-[#F85149] rounded-md transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 'selection' && (
              <motion.div
                key="selection"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <p className="text-gray-400 text-sm mb-6">
                  Select your primary brokerage account to enable algorithmic execution. Quantra supports India's most popular retail and institutional brokers.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {BROKERS.map(broker => (
                    <button
                      key={broker.id}
                      onClick={() => handleSelectBroker(broker)}
                      className="flex flex-col items-center justify-center gap-3 p-4 bg-[#0D1117] border border-[#30363D] hover:border-[#58A6FF] rounded-xl transition-all hover:bg-[#1C2128] group"
                    >
                      <div className={`w-12 h-12 ${broker.color} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <span className="font-bold text-white text-lg">{broker.name.substring(0, 1)}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white">{broker.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'credentials' && (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="bg-[#D29922]/10 border border-[#D29922]/30 rounded-lg p-4 flex gap-3 text-[#D29922] mb-6">
                  <ShieldCheck className="shrink-0 mt-0.5" size={18} />
                  <div className="text-sm">
                    Your API keys are encrypted at rest using AES-256-GCM. We never store your trading password or TOTP secret.
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">App ID / Client ID</label>
                    <input 
                      required
                      type="text" 
                      value={appId}
                      onChange={(e) => setAppId(e.target.value)}
                      placeholder="e.g. ZER123456"
                      className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-3 text-white focus:border-[#58A6FF] outline-none transition-colors" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">API Key</label>
                    <input 
                      required
                      type="password" 
                      placeholder="••••••••••••••••"
                      className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-3 text-white focus:border-[#58A6FF] outline-none transition-colors" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">API Secret</label>
                    <input 
                      required
                      type="password" 
                      placeholder="••••••••••••••••••••••••••••••••"
                      className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-3 text-white focus:border-[#58A6FF] outline-none transition-colors" 
                    />
                  </div>

                  <div className="pt-4 mt-6 border-t border-[#30363D] flex justify-end gap-3">
                    <button 
                      type="button"
                      onClick={handleClose}
                      className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="bg-[#238636] hover:bg-[#2ea043] text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg flex items-center gap-2"
                    >
                      <Key size={16} /> Connect Broker
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 'connecting' && (
              <motion.div
                key="connecting"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="relative">
                  <div className="w-20 h-20 bg-[#58A6FF]/10 rounded-full flex items-center justify-center mb-6">
                    <Key size={32} className="text-[#58A6FF]" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 size={86} className="text-[#58A6FF] animate-spin" strokeWidth={1} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Establishing Secure Connection</h3>
                <p className="text-gray-400 text-sm">Validating API credentials with {selectedBroker?.name}...</p>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-20 h-20 bg-[#39D353]/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} className="text-[#39D353]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Connection Successful!</h3>
                <p className="text-gray-400 text-sm">{selectedBroker?.name} is now connected and ready for live execution.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
