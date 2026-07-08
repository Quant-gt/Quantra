import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { strategyId, amountInr, creatorId } = await req.json();

    // 1. Init Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // 2. Fetch Creator's Linked Settlement Account from Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: settlementAcc, error } = await supabase
      .from('creator_settlement_accounts')
      .select('razorpay_account_id, status')
      .eq('creator_id', creatorId)
      .single();

    if (error || !settlementAcc || settlementAcc.status !== 'activated') {
      return NextResponse.json(
        { error: 'Creator is not fully onboarded for payouts.' },
        { status: 400 }
      );
    }

    // 3. Create the Split Order (90% to Creator, 10% to Quantra)
    // Amounts in Razorpay are in paise (multiply INR by 100)
    const amountInPaise = amountInr * 100;
    const quantraFeePaise = Math.round(amountInPaise * 0.10); // 10%

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_strategy_${strategyId}_${Date.now()}`,
      transfers: [
        {
          account: settlementAcc.razorpay_account_id,
          amount: amountInPaise - quantraFeePaise, // 90% to creator
          currency: 'INR',
          notes: {
            strategy_id: strategyId,
            type: 'marketplace_license'
          },
          linked_account_notes: ['strategy_id'],
          on_hold: 0
        }
      ]
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Razorpay Route Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
