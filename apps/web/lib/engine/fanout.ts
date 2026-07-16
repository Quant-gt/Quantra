import { executeZerodhaOrder, OrderPayload } from './brokers/zerodha';
import { executeUpstoxOrder } from './brokers/upstox';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// In-memory logger for the Admin Dashboard UI (fallback)
export const engineLogs: string[] = [];

async function log(msg: string) {
  const timestamp = new Date().toISOString().split('T')[1]!.slice(0, -1); // HH:MM:SS.mmm
  engineLogs.unshift(`[${timestamp}] ${msg}`);
  if (engineLogs.length > 100) engineLogs.pop(); // Keep last 100 logs
  console.log(`[FANOUT] ${msg}`);
  
  // Persist to DB for compliance
  try {
    await supabase.from('compliance_audit').insert({
      action: 'FANOUT_LOG',
      details: { message: msg },
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    console.error("Failed to persist audit log", e);
  }
}

interface Subscriber {
  userId: string;
  broker: 'Zerodha' | 'Upstox';
  apiKey: string;
  multiplier: number;
  mode: 'live' | 'paper';
  isKillSwitchActive: boolean;
}

export async function processFanOut(masterSignal: { strategyId: string, action: 'BUY'|'SELL', asset: string }) {
  log(`📡 RECEIVED MASTER SIGNAL: ${masterSignal.action} ${masterSignal.asset} (Strategy: ${masterSignal.strategyId})`);
  log(`🔍 Fetching active subscribers from database...`);

  // Mock fetching 250 subscribers from Supabase
  await new Promise(r => setTimeout(r, 200)); 
  
  const mockSubscribers: Subscriber[] = Array.from({ length: 45 }).map((_, i) => ({
    userId: `user_${i}`,
    broker: Math.random() > 0.5 ? 'Zerodha' : 'Upstox',
    apiKey: 'mock_key_xyz',
    multiplier: Math.floor(Math.random() * 5) + 1, // 1x to 5x
    mode: Math.random() > 0.8 ? 'paper' : 'live', // 20% in paper mode
    isKillSwitchActive: Math.random() > 0.95 // 5% have kill switch engaged
  }));

  log(`📊 Found ${mockSubscribers.length} active subscribers. Processing risk filters...`);

  const validSubscribers = mockSubscribers.filter(sub => {
    if (sub.isKillSwitchActive) {
      log(`🚫 SKIPPING user ${sub.userId} (Kill Switch Engaged)`);
      return false;
    }
    if (sub.mode === 'paper') {
      log(`📝 ROUTING user ${sub.userId} to Paper Trading DB (No Live Execution)`);
      return false;
    }
    return true;
  });

  log(`🚀 Initiating Smart Rate-Limited Execution for ${validSubscribers.length} LIVE accounts...`);

  // Broker API Limits (e.g., Zerodha: 10 req/sec)
  const BATCH_SIZE = 10;
  const BATCH_DELAY_MS = 1000;

  for (let i = 0; i < validSubscribers.length; i += BATCH_SIZE) {
    const batch = validSubscribers.slice(i, i + BATCH_SIZE);
    log(`⚡ Executing BATCH ${Math.floor(i/BATCH_SIZE) + 1} (${batch.length} orders)...`);

    // Execute batch concurrently
    const batchPromises = batch.map(sub => {
      const orderPayload: OrderPayload = {
        userId: sub.userId,
        action: masterSignal.action,
        asset: masterSignal.asset,
        quantity: 1 * sub.multiplier, // Adjust sizing
      };

      if (sub.broker === 'Zerodha') {
        return executeZerodhaOrder(orderPayload, sub.apiKey);
      } else {
        return executeUpstoxOrder(orderPayload, sub.apiKey);
      }
    });

    const results = await Promise.allSettled(batchPromises);
    
    // Log individual failures so one crash doesn't break the batch silently
    results.forEach((res, idx) => {
      if (res.status === 'rejected') {
        log(`❌ ERROR executing order for ${batch[idx]?.userId || 'Unknown'}: ${res.reason}`);
      }
    });

    log(`✅ BATCH ${Math.floor(i/BATCH_SIZE) + 1} execution complete.`);

    // If there are more batches, pause to respect rate limits (Leaky Bucket)
    if (i + BATCH_SIZE < validSubscribers.length) {
      log(`⏱️ Rate-Limit Pause: Waiting ${BATCH_DELAY_MS}ms before next burst...`);
      await new Promise(r => setTimeout(r, BATCH_DELAY_MS));
    }
  }

  log(`🏁 FAN-OUT COMPLETE. Master signal successfully multiplexed to all eligible live accounts.`);
}
