import { NextResponse } from 'next/server';
import { processFanOut, engineLogs } from '@/lib/engine/fanout';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // Verify the webhook signature / secret token
    const webhookSecret = request.headers.get('x-webhook-secret');
    const secret = process.env.WEBHOOK_SECRET;
    
    if (!secret) {
      console.error("[SECURITY] WEBHOOK_SECRET is not configured");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (!webhookSecret || webhookSecret !== secret) {
      return NextResponse.json({ error: 'Unauthorized webhook signature' }, { status: 401 });
    }

    const body = await request.json();
    const { strategyId, action, asset } = body;

    if (!strategyId || !action || !asset) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fire & Forget: We do not await this because webhook publishers expect a fast 200 OK 
    // before the potentially long-running rate-limited fan-out completes.
    processFanOut({ strategyId, action, asset }).catch(err => {
      console.error("[ENGINE CRASH]", err);
      engineLogs.unshift(`[ERROR] Engine crashed during fan-out: ${err.message}`);
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Signal received. Fan-out execution engine engaged.' 
    });

  } catch (error) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

// Simple GET endpoint for our Admin UI to poll the live logs
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('users')
    .select('roles')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.roles?.includes('admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({ logs: engineLogs });
}
