import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Query actual tables
    const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true });
    const { count: activeSubscriptions } = await supabase.from('marketplace_subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active');
    const { count: publishedAlgos } = await supabase.from('strategies').select('*', { count: 'exact', head: true }).eq('status', 'published');
    
    // Fetch pending KYC from user_metadata
    const { createClient: createAdminClient } = await import('@supabase/supabase-js');
    const adminAuthClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: authData } = await adminAuthClient.auth.admin.listUsers();
    const pendingKyc = authData?.users.filter((u: any) => u.user_metadata?.kyc_status === 'pending').length || 0;

    // Calculate MRR from subscriptions by joining and aggregating monthly strategy fees
    
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
