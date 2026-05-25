const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/web/.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in apps/web/.env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log("Testing connection to:", supabaseUrl);
  
  // Try to fetch strategies table
  const { data, error } = await supabase.from('strategies').select('*').limit(1);
  
  if (error) {
    console.error("Connection failed or table doesn't exist:");
    console.error(error);
  } else {
    console.log("Connection successful! Found strategies:", data);
  }
}

testConnection();
