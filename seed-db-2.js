const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/web/.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const MOCK_STRATEGIES = [
  {
    slug: "banknifty-trend-follower",
    name: "BankNifty Trend Follower",
    type: "black_box",
    algo_id: "ALG-BNF-893",
    creator_id: "00000000-0000-0000-0000-000000000001",
    min_capital: 200000,
    fee: 1499,
    profit_share: 0,
    is_public_marketplace: true,
    status: 'live',
    logic_graph: {
      metrics: {
        cagr: 42.5,
        max_drawdown: 8.2,
        sharpe_ratio: 2.1,
        win_rate: 62,
        subscriber_count: 1450
      }
    }
  },
  {
    slug: "nifty-mean-reversion",
    name: "Nifty Mean Reversion",
    type: "white_box",
    algo_id: "ALG-NFT-112",
    creator_id: "00000000-0000-0000-0000-000000000001",
    min_capital: 100000,
    fee: 0,
    profit_share: 10,
    is_public_marketplace: true,
    status: 'live',
    logic_graph: {
      metrics: {
        cagr: 28.4,
        max_drawdown: 4.1,
        sharpe_ratio: 1.8,
        win_rate: 71,
        subscriber_count: 890
      }
    }
  },
  {
    slug: "reliance-volatility-breakout",
    name: "Reliance Volatility Breakout",
    type: "black_box",
    algo_id: "ALG-REL-441",
    creator_id: "00000000-0000-0000-0000-000000000001",
    min_capital: 500000,
    fee: 2999,
    profit_share: 0,
    is_public_marketplace: true,
    status: 'live',
    logic_graph: {
      metrics: {
        cagr: 55.2,
        max_drawdown: 12.5,
        sharpe_ratio: 2.4,
        win_rate: 55,
        subscriber_count: 320
      }
    }
  }
];

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
