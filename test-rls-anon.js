const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !anonKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, anonKey);

async function testInsert() {
  
  // 1. Test creator_earnings
  const mockEarnings = {
    creator_id: '00000000-0000-0000-0000-000000000001',
    month_year: '2026-06',
    total_pnl: 1000,
    net_payout: 900
  };
  const res1 = await supabase.from('creator_earnings').insert(mockEarnings).select();
  if (res1.error) {
    console.log(`- creator_earnings INSERT failed: ${res1.error.message} (code ${res1.error.code})`);
  } else {
    console.log(`- creator_earnings INSERT succeeded! RLS is DEFINITELY DISABLED ❌`);
    // Clean up
    if (res1.data && res1.data[0]) {
      await supabase.from('creator_earnings').delete().eq('id', res1.data[0].id);
    }
  }

  // 2. Test compliance_audit
  const mockAudit = {
    event_type: 'TEST_RLS_AUDIT',
    symbol: 'RELIANCE'
  };
  const res2 = await supabase.from('compliance_audit').insert(mockAudit).select();
  if (res2.error) {
    console.log(`- compliance_audit INSERT failed: ${res2.error.message} (code ${res2.error.code})`);
  } else {
    console.log(`- compliance_audit INSERT succeeded! RLS is DEFINITELY DISABLED ❌`);
    if (res2.data && res2.data[0]) {
      await supabase.from('compliance_audit').delete().eq('id', res2.data[0].id);
    }
  }
}

testInsert();
