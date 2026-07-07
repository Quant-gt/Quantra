import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const masterTokenMap = {
    RELIANCE: { angelone: "3045", zerodha: "2885", dhan: "13045", fyers: "11045", shoonya: "RELIANCE-EQ" },
    TCS: { angelone: "11536", zerodha: "2953", dhan: "111536", fyers: "111536", shoonya: "TCS-EQ" },
    INFY: { angelone: "3506", zerodha: "4080", dhan: "13506", fyers: "11506", shoonya: "INFY-EQ" },
    HDFCBANK: { angelone: "1333", zerodha: "1270", dhan: "11333", fyers: "11333", shoonya: "HDFCBANK-EQ" },
    SBIN: { angelone: "3045", zerodha: "3000", dhan: "13045", fyers: "13045", shoonya: "SBIN-EQ" }
  };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from('master_scrip_map')
        .select('data')
        .eq('key', 'master_token_map')
        .single();

      if (!error && data && data.data) {
        return NextResponse.json({ success: true, data: data.data });
      }
    } catch (err) {
      console.warn("Error fetching Master Token Map from DB, falling back to static map:", err);
    }
  }

  // Fallback to static mapping dictionary
  return NextResponse.json({ success: true, data: masterTokenMap });
}
