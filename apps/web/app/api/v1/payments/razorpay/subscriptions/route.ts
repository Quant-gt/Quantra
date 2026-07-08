import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

// Pre-configured plan IDs from Razorpay Dashboard (Mocked for now)
const PLAN_IDS: Record<string, string> = {
  'tier_2_buyer': 'plan_LiveExecPass002', // ₹499/mo
  'tier_3_buyer': 'plan_QuantPro003',     // ₹1,499/mo
  'tier_4_buyer': 'plan_AlphaElite004',   // ₹3,999/mo
  'tier_2_creator': 'plan_RisingVendor002', // ₹999/mo
  'tier_3_creator': 'plan_InstStudio003',   // ₹2,499/mo
  'tier_4_creator': 'plan_SebiPartner004',  // ₹4,999/mo
};

export async function POST(req: Request) {
  try {
    const { tierId, userId } = await req.json();

    const planId = PLAN_IDS[tierId];
    if (!planId) {
      return NextResponse.json({ error: 'Invalid subscription tier' }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 120, // E-mandate for 10 years by default
    });

    // You can optionally create an initial pending record in user_subscriptions here
    // But it's usually handled entirely by the webhook once payment is captured.

    return NextResponse.json(subscription);
  } catch (error: any) {
    console.error('Razorpay Subscription Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
