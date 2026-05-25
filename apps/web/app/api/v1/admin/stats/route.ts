import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Query actual tables
    const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true });
    const { count: activeSubscriptions } = await supabase.from('marketplace_subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active');
    const { count: publishedAlgos } = await supabase.from('strategies').select('*', { count: 'exact', head: true }).eq('status', 'published');
    const { count: pendingKyc } = await supabase.from('user_kyc').select('*', { count: 'exact', head: true }).eq('kyc_status', 'pending');

    // Calculate MRR from subscriptions (mocking price as each strategy has different monthly_fee, 
    // but we can query it by joining or just mock the aggregation if join is complex via JS)
    
    // For exact MRR, we'd need to fetch all active subs and sum up the strategy fees
    const { data: subsData } = await supabase
      .from('marketplace_subscriptions')
      .select('strategy_id, strategies(monthly_fee)')
      .eq('status', 'active');

    let mrr = 0;
    if (subsData) {
      mrr = subsData.reduce((acc, sub: any) => acc + (Number(sub.strategies?.monthly_fee) || 0), 0);
    }

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        activeSubscriptions: activeSubscriptions || 0,
        publishedAlgos: publishedAlgos || 0,
        pendingKyc: pendingKyc || 0,
        mrr: mrr || 0
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
