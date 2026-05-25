import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: strategies, error } = await supabase
      .from('strategies')
      .select('id, name, status, monthly_fee, created_at, users:creator_id(full_name, email)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Fetch subscriber counts (can be done with a view in SQL, but doing it via JS here for simplicity)
    const { data: subs } = await supabase
      .from('marketplace_subscriptions')
      .select('strategy_id')
      .eq('status', 'active');

    const subCounts: Record<string, number> = {};
    if (subs) {
      subs.forEach((sub: any) => {
        subCounts[sub.strategy_id] = (subCounts[sub.strategy_id] || 0) + 1;
      });
    }

    const enhancedStrategies = strategies.map((s: any) => ({
      ...s,
      subscriber_count: subCounts[s.id] || 0,
      creator_name: s.users?.full_name || 'Unknown',
      creator_email: s.users?.email || ''
    }));

    return NextResponse.json({ strategies: enhancedStrategies });
  } catch (error) {
    console.error('Error fetching admin strategies:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
