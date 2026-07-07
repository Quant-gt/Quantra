const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !anonKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, anonKey);

const TABLES = [
  'users',
  'user_payments',
  'user_kyc',
  'broker_connections',
  'strategies',
  'marketplace_subscriptions',
  'execution_logs',
  'user_portfolio_risk',
  'compliance_audit',
  'admin_alerts',
  'user_watchlist',
  'strategy_metrics',
  'strategy_versions',
  'backtest_results',
  'scanner_configs',
  'scan_results',
  'notification_preferences',
  'creator_earnings'
];

async function detectRLS() {
  console.log("Analyzing RLS status for all tables:");
  
  for (const table of TABLES) {
    // Try to insert a dummy/empty row.
    // If RLS is enabled, this will fail with RLS violation (42501 or 401).
    // If RLS is disabled, it will proceed to database constraints (null constraint, foreign key, or succeed).
    const { data, error, status } = await supabase.from(table).insert({}).select();
    
    let isRlsEnabled = false;
    let reason = '';
    
    if (error) {
      if (error.code === '42501' || status === 401 || error.message.includes('row-level security')) {
        isRlsEnabled = true;
        reason = `RLS is ENABLED (returned RLS violation, code ${error.code}, message: ${error.message})`;
      } else {
        isRlsEnabled = false;
        reason = `RLS is DISABLED (bypassed RLS, hit constraint/schema error, code ${error.code}, message: ${error.message})`;
      }
    } else {
      isRlsEnabled = false;
      reason = `RLS is DISABLED (insert succeeded with status ${status})`;
      // Delete the dummy inserted row if it succeeded
      if (data && data[0] && data[0].id) {
        await supabase.from(table).delete().eq('id', data[0].id);
      }
    }
    
    console.log(`- ${table}: ${isRlsEnabled ? 'SECURE ✅' : 'VULNERABLE ❌'} - ${reason}`);
  }
}

detectRLS();
