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

  const handlePayment = async () => {
    setLoading(true);
    try {
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
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use public key here
        amount: amount ? amount * 100 : undefined,
        currency: "INR",
        name: "Quantra Technologies",
        description: type === 'subscription' ? "SaaS Platform Pass" : "Marketplace Strategy License",
        order_id: orderId,
        subscription_id: subscriptionId,
        handler: function (response: any) {
          alert(`Payment Successful! ID: ${response.razorpay_payment_id}`);
          // Polling the backend or relying on webhook to update UI state
        },
        prefill: {
          name: "Quantra User", // Fetch dynamically if available
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
    </>
  );
}
