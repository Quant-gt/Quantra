'use client';

import { useState } from 'react';
import Script from 'next/script';

interface RazorpayButtonProps {
  type: 'subscription' | 'marketplace_split';
  planTierId?: string;
  strategyId?: string;
  creatorId?: string;
  amountInr?: number;
  userId: string;
  buttonText: string;
  className?: string;
}

export default function RazorpayButton({
  type,
  planTierId,
  strategyId,
  creatorId,
  amountInr,
  userId,
  buttonText,
  className = "w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
}: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!keyId) {
        setShowError(true);
        setLoading(false);
        return;
      }
      
      let orderId, subscriptionId;
      let amount = amountInr;

      if (type === 'subscription') {
        // Fetch Subscription ID
        const res = await fetch('/api/v1/payments/razorpay/subscriptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tierId: planTierId, userId })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        subscriptionId = data.id;
      } else {
        // Fetch Route Order ID
        const res = await fetch('/api/v1/payments/razorpay/route-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ strategyId, creatorId, amountInr, userId })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        orderId = data.id;
        amount = data.amount / 100; // Razorpay sends back paise
      }

      const options = {
        key: keyId, // Use the verified public key here
        amount: amount ? amount * 100 : undefined,
        currency: "INR",
        name: "SigmaSpire Technologies",
        description: type === 'subscription' ? "SaaS Platform Pass" : "Marketplace Strategy License",
        order_id: orderId,
        subscription_id: subscriptionId,
        handler: function (response: any) {
          alert(`Payment Successful! ID: ${response.razorpay_payment_id}`);
          // Polling the backend or relying on webhook to update UI state
        },
        prefill: {
          name: "SigmaSpire User", // Fetch dynamically if available
          email: "user@example.com"
        },
        theme: {
          color: "#2563EB" // Blue-600 to match platform
        }
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on('payment.failed', function (response: any) {
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp1.open();

    } catch (err: any) {
      alert(`Error initiating checkout: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button 
        onClick={handlePayment} 
        disabled={loading}
        className={className}
      >
        {loading ? 'Processing...' : buttonText}
      </button>
      {showError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md shadow-2xl text-center transform transition-all">
            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-700">
              <span className="text-zinc-400 text-xl">⚠️</span>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Integration Pending</h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Payment integration gateway initializing. Please ensure your workspace credentials or broker connection profiles are active to continue checkout operations.
            </p>
            <button 
              onClick={() => setShowError(false)}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors w-full"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}
    </>
  );
}
