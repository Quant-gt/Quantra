import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set({ name, value, ...options }); } catch (e) {}
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set({ name, value: '', ...options }); } catch (e) {}
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get creator's strategies
  const { data: strategies } = await supabase
    .from('strategies')
    .select('id, name, monthly_fee')
    .eq('creator_id', user.id);

  if (!strategies || strategies.length === 0) {
    return NextResponse.json({
      earningsData: [],
      mrr: 0,
      activeSubscribers: 0,
      hasData: false
    });
  }

  const strategyIds = strategies.map(s => s.id);

  // Get active subscriptions for these strategies
  const { data: subs } = await supabase
    .from('marketplace_subscriptions')
    .select('strategy_id, status, created_at')
    .in('strategy_id', strategyIds)
    .eq('status', 'active');

  const totalSubs = subs?.length || 0;
  
  if (totalSubs === 0) {
    return NextResponse.json({
      earningsData: [],
      mrr: 0,
      activeSubscribers: 0,
      hasData: false
    });
  }

  let mrr = 0;
  subs?.forEach(sub => {
    const strategy = strategies.find(s => s.id === sub.strategy_id);
    if (strategy && strategy.monthly_fee) {
      mrr += parseFloat(strategy.monthly_fee.toString());
    }
  });

  // Calculate earnings mock history based on active subs (distribute them over months roughly)
  // For true implementation, this would track actual payment invoices.
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  let running = 0;
  const earningsData = months.map(m => {
    running += Math.floor(mrr / 6);
    return { name: m, amount: running };
  });

  return NextResponse.json({
    earningsData,
    mrr,
    activeSubscribers: totalSubs,
    hasData: true
  });
}
