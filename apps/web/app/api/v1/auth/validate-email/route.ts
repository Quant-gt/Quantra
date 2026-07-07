import { NextResponse } from 'next/server';
import { resolveMx } from 'dns/promises';
import { createClient } from '@supabase/supabase-js';

// Static notorious disposable email domains blocklist (Tier 1)
const notoriousDomains = new Set([
  'mailinator.com',
  'yopmail.com',
  'tempmail.com',
  '10minutemail.com',
  'trashmail.com',
  'burnermail.io',
  'guerrillamail.com',
  'sharklasers.com',
  'dispostable.com',
  'getairmail.com',
  'maildrop.cc'
]);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, valid: false }, { status: 400 });
    }

    const parts = email.split('@');
    if (parts.length !== 2) {
      return NextResponse.json({ success: true, valid: false });
    }

    const domain = parts[1]!.toLowerCase().trim();

    // Tier 1: Local Static Blocklist
    if (notoriousDomains.has(domain)) {
      return NextResponse.json({ success: true, valid: false });
    }

    // Tier 3: Dynamic Open-Source Repository blocklist cached in Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data } = await supabase
          .from('email_blocklist_cache')
          .select('domains')
          .eq('key', 'disposable_email_blocklist')
          .single();

        if (data && Array.isArray(data.domains)) {
          const cachedDomains = new Set(data.domains);
          if (cachedDomains.has(domain)) {
            return NextResponse.json({ success: true, valid: false });
          }
        }
      } catch (dbError) {
        console.warn("DB blocklist lookup failed, proceeding to Tier 2:", dbError);
      }
    }

    // Tier 2: Real-time MX Record Validation (Verify active mail servers)
    try {
      const mxRecords = await resolveMx(domain);
      if (!mxRecords || mxRecords.length === 0) {
        return NextResponse.json({ success: true, valid: false });
      }
    } catch (dnsError) {
      // If DNS MX lookup fails (domain has no mail servers or does not exist), fail validation
      return NextResponse.json({ success: true, valid: false });
    }

    // Passed all validation tiers
    return NextResponse.json({ success: true, valid: true });
  } catch (err) {
    // Sanitized Error Mitigation: Suppress deep system logging on public triggers
    return NextResponse.json({ success: false, valid: false }, { status: 500 });
  }
}
