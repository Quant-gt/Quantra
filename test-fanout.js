const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load env from apps/web/.env
dotenv.config({ path: './apps/web/.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
  console.log("=== Copy Trading Fan-Out Test ===");

  // 1. Create a mock creator
  const { data: creator } = await supabase.auth.admin.createUser({
    email: `creator_${Date.now()}@quantra.com`,
    password: 'password123',
    email_confirm: true,
    user_metadata: { full_name: 'Priya (Creator)' }
  });
  
  if (!creator.user) return console.error("Failed to create creator");
  console.log(`✓ Created Mock Creator: ${creator.user.id}`);

  // 2. Create a mock strategy for the creator
  const { data: strategy } = await supabase.from('strategies').insert({
    creator_id: creator.user.id,
    name: 'Breakout Master V1',
    strategy_type: 'copy_trade',
    status: 'published'
  }).select().single();

  console.log(`✓ Created Copy Trade Strategy: ${strategy.id}`);

  // 3. Create mock subscribers
  for (let i = 1; i <= 3; i++) {
    const { data: sub } = await supabase.auth.admin.createUser({
      email: `sub_${i}_${Date.now()}@quantra.com`,
      password: 'password123',
      email_confirm: true,
      user_metadata: { full_name: `Aman (Subscriber ${i})` }
    });
    
    // Subscribe with different multipliers
    const multipliers = [0.5, 1.0, 2.0];
    
    await supabase.from('marketplace_subscriptions').insert({
      user_id: sub.user.id,
      strategy_id: strategy.id,
      allocation_multiplier: multipliers[i-1],
      status: 'active'
    });
    console.log(`  - Added Subscriber ${i} with ${multipliers[i-1]}x multiplier`);
  }

  // 4. Simulate the Fan-Out Logic (Extracting it from index.ts)
  console.log("\n=== Firing Master Signal: BUY RELIANCE (Base Qty: 100) ===");
  
  const base_qty = 100;
  
  const { data: subscribers, error: fetchError } = await supabase
    .from('marketplace_subscriptions')
    .select('user_id, allocation_multiplier')
    .eq('strategy_id', strategy.id)
    .eq('status', 'active');

  if (fetchError) {
    console.error("Fetch Error:", fetchError);
    return;
  }

  const executionLogs = [];
  
  for (const sub of subscribers) {
    const multiplier = sub.allocation_multiplier || 1.0;
    const finalQty = Math.max(1, Math.floor(base_qty * multiplier)); 
    
    const broker_order_id = `FAN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    executionLogs.push({
      user_id: sub.user_id,
      strategy_id: strategy.id,
      symbol: 'RELIANCE',
      action: 'BUY',
      quantity: finalQty,
      price: 2500,
      execution_type: 'live',
      status: 'success',
      broker_order_id
    });
  }

  // Bulk Insert
  const { data: logs, error } = await supabase
    .from('execution_logs')
    .insert(executionLogs)
    .select('user_id, quantity, broker_order_id');

  if (error) {
    console.error("Failed to write logs:", error);
  } else {
    console.log("\n✓ Fan-Out Execution Successful! Generated Logs:");
    console.table(logs);
  }
}

runTest();
