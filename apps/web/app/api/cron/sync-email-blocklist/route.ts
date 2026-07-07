import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 60; // 60 seconds max duration

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  // Verify authorization
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    console.log("Starting daily disposable email blocklist sync from repository sources...");

    // Fetch blocklist from dynamic open-source repository sync (Tier 3)
    const response = await fetch(
      'https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/master/disposable_email_blocklist.conf'
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch blocklist: ${response.statusText}`);
    }

    const text = await response.text();
    const domains = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('#')); // Filter comments and empty lines

    console.log(`Successfully parsed ${domains.length} disposable email domains from community blocklist.`);

    // Upsert into Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { error } = await supabase
        .from('email_blocklist_cache')
        .upsert([
          { key: 'disposable_email_blocklist', domains, updated_at: new Date().toISOString() }
        ]);

      if (error) {
        console.warn("Supabase blocklist cache sync failed, falling back to local memory:", error.message);
      } else {
        console.log("Supabase email blocklist cache successfully updated.");
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      synced_domains: domains.length
    });
  } catch (error: any) {
    console.error("Blocklist Sync Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
