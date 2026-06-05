"use client";`nimport { toast } from "sonner";

import { useState } from "react";
import { CreditCard, CheckCircle, XCircle, RefreshCw } from "lucide-react";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([
    { id: '1', name: 'Nifty Options Scalper', creator: 'Quant Quentin', fee: 2000, profit_share: 10, status: 'active', next_billing: '2026-06-01' },
    { id: '2', name: 'BankNifty Trend Follower', creator: 'Mentor Meera', fee: 1500, profit_share: 15, status: 'active', next_billing: '2026-06-15' }
  ]);

  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this subscription? You will lose access at the end of the billing period.")) return;
    
    setLoadingId(id);
    try {
      const res = await fetch('/api/v1/billing/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: id })
      });
      const data = await res.json();
      
      if (data.success) {
        setSubscriptions(prev => prev.map(sub => 
          sub.id === id ? { ...sub, status: 'cancelled_pending' } : sub
        ));
      } else {
        toast.error("Failed to cancel subscription");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold text-white mb-2">My Subscriptions</h1>
          <p className="text-white/60">
            Manage your active strategy subscriptions and billing.
          </p>
        </div>

        <div className="space-y-6">
          {subscriptions.map((sub) => (
            <div key={sub.id} className="glass-panel p-6 rounded-xl border border-white/10">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                {/* Info */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{sub.name}</h3>
                  <p className="text-sm text-white/50 mb-2">by {sub.creator}</p>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      sub.status === 'active' ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                    }`}>
                      {sub.status === 'active' ? 'Active' : 'Cancellation Pending'}
                    </span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="text-left md:text-right">
                  <p className="text-lg font-bold text-white">₹{sub.fee}/mo</p>
                  <p className="text-xs text-white/50">{sub.profit_share}% Profit Share</p>
                  <p className="text-xs text-white/30 mt-1">Next bill: {sub.next_billing}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {sub.status === 'active' && (
                    <button
                      onClick={() => handleCancel(sub.id)}
                      disabled={loadingId === sub.id}
                      className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 px-4 py-2 rounded-lg transition-colors text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
                    >
                      {loadingId === sub.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                      Cancel
                    </button>
                  )}
                  <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg transition-colors text-sm font-semibold">
                    Manage
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Payment Method */}
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Payment Method
            </h3>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-xs font-bold text-white">
                  VISA
                </div>
                <div>
                  <p className="text-white font-medium">•••• •••• •••• 4242</p>
                  <p className="text-xs text-white/50">Expires 12/28</p>
                </div>
              </div>
              <button className="text-primary hover:underline text-sm font-medium">
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

