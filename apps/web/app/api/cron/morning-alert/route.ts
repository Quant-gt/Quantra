import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 10; 

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Select users with daily_auth_expired status
    const { data, error } = await supabase
      .from('marketplace_subscriptions')
      .select('user_id')
      .eq('status', 'daily_auth_expired');

    if (error) throw error;

    // Simulate sending morning alerts via FCM/Brevo
    console.log(`Sending morning alerts to ${data.length} users...`);

    return NextResponse.json({ success: true, count: data.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
