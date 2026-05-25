const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/web/.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const MOCK_STRATEGIES = [
  {
    slug: "banknifty-trend-follower",
    cagr: 42.5,
    max_drawdown: 8.2,
    sharpe_ratio: 2.1,
    win_rate: 62
  }
];

async function seed() {
  console.log("Upserting performance metrics...");
  const { data, error } = await supabase
    .from('strategies')
    .upsert(MOCK_STRATEGIES, { onConflict: 'slug' })
    .select();
    
  if (error) {
    console.error("Seed failed:", error);
  } else {
    console.log("Seeded successfully:", data);
  }
}

seed();
