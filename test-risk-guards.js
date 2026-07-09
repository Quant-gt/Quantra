const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: './apps/web/.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
  console.log("=== Dynamic Risk Guards Test ===");

  // 1. Create a mock creator and strategy
  const { data: creator } = await supabase.auth.admin.createUser({
    email: `creator_${Date.now()}@sigmaspire.com`,
    password: 'password123',
    email_confirm: true
  });
  
  const { data: strategy } = await supabase.from('strategies').insert({
    creator_id: creator.user.id,
    name: 'Risk Guard Test Algo',
    strategy_type: 'copy_trade',
    status: 'published'
  }).select().single();

  // 2. Create Subscribers and Risk Profiles
  const subs = [];
  for (let i = 1; i <= 3; i++) {
    const { data: sub } = await supabase.auth.admin.createUser({
      email: `sub_${i}_${Date.now()}@sigmaspire.com`,
      password: 'password123',
      email_confirm: true
    });
    
    // Subscribe with standard 1x multiplier
    await supabase.from('marketplace_subscriptions').insert({
      user_id: sub.user.id,
      strategy_id: strategy.id,
      allocation_multiplier: 1.0,
      status: 'active'
    });
    
    subs.push(sub.user.id);
  }

  // Set up Risk Profiles
  // Sub 1: Normal, Fixed Size, Healthy PnL
  await supabase.from('user_portfolio_risk').insert({
    user_id: subs[0],
    max_daily_drawdown_limit: -5000,
    position_sizing_model: 'fixed',
    today_realised_pnl: 0,
    today_unrealised_pnl: 0
  });

  // Sub 2: Kelly Criterion, Healthy PnL
  await supabase.from('user_portfolio_risk').insert({
    user_id: subs[1],
    max_daily_drawdown_limit: -5000,
    position_sizing_model: 'kelly_criterion',
    today_realised_pnl: 1000,
    today_unrealised_pnl: 0
  });

  // Sub 3: Fixed Size, BREACHED Drawdown (Loss of -6000)
  await supabase.from('user_portfolio_risk').insert({
    user_id: subs[2],
    max_daily_drawdown_limit: -5000,
    position_sizing_model: 'fixed',
    today_realised_pnl: -4000,
    today_unrealised_pnl: -2000 // Total: -6000 (Breached)
  });

  console.log("✓ Created 3 Subscribers with different Risk Profiles");

  // 3. Hit the Execution Fan-Out API
  console.log("\n=== Firing Master Signal (Base Qty: 100) ===");
  
  const res = await fetch('http://localhost:3002/execute/fanout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creator_id: creator.user.id,
      strategy_id: strategy.id,
      symbol: 'NIFTY',
      action: 'BUY',
      base_qty: 100,
      price: 20000
    })
  });

  const data = await res.json();
  console.log("API Response:", data);

  // 4. Verify Execution Logs
  const { data: logs } = await supabase
    .from('execution_logs')
    .select('user_id, quantity, status, broker_order_id')
    .eq('strategy_id', strategy.id)
    .order('quantity', { ascending: true });

  console.log("\n✓ Execution Logs Verified:");
  console.table(logs);
}

runTest();
