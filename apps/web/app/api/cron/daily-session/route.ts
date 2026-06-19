import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This function can run for a maximum of 5 seconds on the free tier, 
// but Vercel Cron allows extending with maxDuration if needed
export const maxDuration = 10; 

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized execution
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Use service role key to bypass RLS for admin cron task
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // UPDATE marketplace_subscriptions SET status=daily_auth_expired WHERE mode=live AND status=active.
    const { data, error } = await supabase
      .from('marketplace_subscriptions')
      .update({ status: 'daily_auth_expired' })
      .eq('mode', 'live')
      .eq('status', 'active');

    if (error) throw error;

    // Log the compliance event
    await supabase.from('compliance_audit').insert({
      event_type: 'daily_session_invalidated',
      payload: { timestamp: new Date().toISOString() }
    });

    // In a real implementation, we'd also clear broker_connections.access_token 
    // and trigger SMS/Push notifications here using Brevo/Fast2SMS.

    return NextResponse.json({ success: true, message: 'Daily sessions invalidated per SEBI mandate.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
