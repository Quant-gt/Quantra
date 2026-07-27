const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ALL_MIGRATED_TABLES = [
  // Root migrations
  'users',
  'user_payments',
  'user_kyc',
  'broker_connections',
  'strategies',
  'marketplace_subscriptions',
  'execution_logs',
  'user_portfolio_risk',
  'user_watchlists',
  'deployed_bots',
  'backtest_runs',
  'saved_scans',
  'strategy_positions',
  'master_execution_log',
  
  // API migrations
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

async function inspect() {
  for (const table of ALL_MIGRATED_TABLES) {
    const { error } = await supabase.from(table).select('*').limit(0);
    if (error) {
      if (error.code === '42P01') {
        console.log(`- ${table}: DOES NOT EXIST ❌`);
      } else {
        console.log(`- ${table}: EXISTS (but returned error: ${error.message} [code ${error.code}]) ⚠️`);
      }
    } else {
      console.log(`- ${table}: EXISTS & ACCESSIBLE ✅`);
    }
  }
}

inspect();
