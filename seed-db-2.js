const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/web/.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const MOCK_STRATEGIES = require('./mock-strategies.js');

async function seed() {
  console.log("Upserting strategies with metrics in logic_graph...");
  
  const { data, error } = await supabase
    .from('strategies')
    .upsert(MOCK_STRATEGIES, { onConflict: 'slug' })
    .select();
    
  if (error) {
    console.error("Seed failed:", error);
  } else {
    console.log("Seeded successfully:", data.length, "rows.");
  }
}

seed();
