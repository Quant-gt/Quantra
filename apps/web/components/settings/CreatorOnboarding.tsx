import React, { useState } from 'react';
import { Briefcase, CheckCircle2, ShieldAlert, ChevronRight, Loader2 } from 'lucide-react';

export default function CreatorOnboarding() {
  const [panNumber, setPanNumber] = useState('');
  const [isRia, setIsRia] = useState(false);
  const [sebiReg, setSebiReg] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to onboard as a creator.');
      }

      const token = session.access_token; 
      const userId = session.user.id;

      const response = await fetch('/api/v1/creator/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-user-id': userId
        },
        body: JSON.stringify({
          pan_number: panNumber,
          is_ria: isRia,
          sebi_registration_number: sebiReg
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to onboard as creator');
      }

      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message);
    }
  };

  if (status === 'success') {
    return (
      <div className="p-8 text-center h-full flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-[#39D353]/10 border border-[#39D353]/30 rounded-full flex items-center justify-center text-[#39D353] mb-6">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Application Submitted</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          Your Creator KYC application is currently pending verification. You will be notified once your PAN and SEBI details have been cleared by our compliance team.
        </p>
        <button className="bg-[#21262D] hover:bg-[#30363D] text-white border border-[#30363D] px-6 py-2 rounded-md text-sm font-medium transition-colors">
          View Creator Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="text-[#58A6FF]" size={24} />
            Become a Creator
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Publish your proprietary algorithms to the marketplace and earn revenue from subscribers.
          </p>
        </div>
      </div>

      <div className="bg-[#D29922]/10 border border-[#D29922]/30 rounded-lg p-5 flex gap-3 text-[#D29922] mb-8">
        <ShieldAlert className="shrink-0 mt-0.5" size={20} />
        <div className="text-sm">
          <strong className="block mb-1 text-[#E3B341] text-base">SEBI Compliance Notice</strong>
          To monetize algorithms on SigmaSpire, you must provide your Permanent Account Number (PAN) for tax and identity verification. If you are providing investment advice or guaranteed returns, you MUST provide your SEBI Registration Number.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Permanent Account Number (PAN) <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            required
            value={panNumber}
            onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
            placeholder="ABCDE1234F" 
            maxLength={10}
            className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-3 text-white font-mono uppercase focus:border-[#58A6FF] outline-none transition-colors" 
          />
        </div>

        <div className="p-4 border border-[#30363D] rounded-lg bg-[#1C2128]">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-bold mb-1">Are you a SEBI Registered Investment Advisor (RIA)?</h4>
              <p className="text-xs text-gray-400">Required if you intend to offer advisory services or take profit shares.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isRia} onChange={(e) => setIsRia(e.target.checked)} />
              <div className="w-11 h-6 bg-[#30363D] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#238636]"></div>
            </label>
          </div>

          {isRia && (
            <div className="mt-4 pt-4 border-t border-[#30363D] space-y-2 animate-in fade-in slide-in-from-top-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">SEBI Registration Number <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required={isRia}
                value={sebiReg}
                onChange={(e) => setSebiReg(e.target.value.toUpperCase())}
                placeholder="INA000000000" 
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-3 text-white font-mono uppercase focus:border-[#58A6FF] outline-none transition-colors" 
              />
            </div>
          )}
        </div>

        {status === 'error' && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {errorMessage}
          </div>
        )}

        <div className="pt-6 border-t border-[#30363D] flex justify-end">
          <button 
            type="submit" 
            disabled={status === 'loading' || panNumber.length !== 10 || (isRia && !sebiReg)}
            className="bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 disabled:hover:bg-[#238636] text-white px-8 py-3 rounded-lg text-sm font-bold transition-all shadow-lg flex items-center gap-2"
          >
            {status === 'loading' ? (
              <><Loader2 size={18} className="animate-spin" /> Processing KYC...</>
            ) : (
              <>Submit Application <ChevronRight size={18} /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
