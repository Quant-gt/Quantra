import express from 'express';
import { Redis } from '@upstash/redis';
import { createClient } from '@supabase/supabase-js';

const app = express();
const port = process.env.PORT || 3002;

// Initialize Redis & Supabase
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

app.use(express.json());

// Main order placement endpoint (simulated)
app.post('/execute', async (req, res) => {
  const { user_id, strategy_id, subscription_id, symbol, qty, price, algo_id } = req.body;

  // 1. Check OPS Limit
  const timestampSecond = Math.floor(Date.now() / 1000);
  const opsKey = `ops:${subscription_id}:${timestampSecond}`;
  
  try {
    const currentOps = await redis.incr(opsKey);
    if (currentOps === 1) {
      await redis.expire(opsKey, 2); // 2 second TTL
    }

    // Write current OPS to DB for dashboard monitoring
    await supabase
      .from('marketplace_subscriptions')
      .update({ current_ops: currentOps })
      .eq('id', subscription_id);

    // SEBI Hard-Throttle: Pause strategy at 10 OPS
    if (currentOps >= 10) {
      console.warn(`[THROTTLE] Subscription ${subscription_id} breached 10 OPS limit.`);
      
      await supabase
        .from('marketplace_subscriptions')
        .update({ status: 'paused' })
        .eq('id', subscription_id);

      await supabase.from('admin_alerts').insert({
        user_id,
        strategy_id,
        alert_type: 'ops_breach_throttle',
        message: `Subscription ${subscription_id} hit 10 OPS and was hard-paused.`,
      });

      return res.status(429).json({
        success: false,
        error: 'SEBI Compliance: OPS limit (10/sec) breached. Strategy paused.',
      });
    }

    // 2. Validate Algo-ID exists
    if (!algo_id) {
      return res.status(400).json({ success: false, error: 'SEBI Compliance: Algo-ID missing.' });
    }

    // 3. Place Broker Order (Simulated)
    const broker_order_id = `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const broker_status = 'PLACED';

    // 4. Log to compliance_audit TimescaleDB
    await supabase.from('compliance_audit').insert({
      user_id,
      algo_id,
      static_ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      api_key_hash: 'simulated_hash', // In a real app, hash the user's broker API key
      event_type: 'order_placed',
      symbol,
      qty,
      price,
      broker_order_id,
      broker_status,
      ops_at_event: currentOps,
      payload: { ...req.body },
    });

    return res.json({ success: true, broker_order_id, broker_status });

  } catch (error: any) {
    console.error('Execution Error:', error);
    return res.status(500).json({ success: false, error: 'Internal execution error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '0.1.0', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Execution Engine (SEBI Compliant) running on port ${port}`);
});
