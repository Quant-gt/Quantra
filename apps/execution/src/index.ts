import express from 'express';
import { Redis } from '@upstash/redis';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import { runBacktest } from './backtester.js';

const app = express();
app.set('trust proxy', 1);
app.use(cors());
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

// Authentication middleware using Supabase Auth JWT
const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1]!;
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
    }
    req.headers['x-user-id'] = user.id;
    next();
  } catch (err: any) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({ success: false, error: 'Internal auth error' });
  }
};

// Main order placement endpoint (simulated)
app.post('/execute', authMiddleware, async (req, res) => {
  const { user_id, strategy_id, subscription_id, symbol, qty, price, algo_id } = req.body;

  const verifiedUserId = req.headers['x-user-id'] as string;
  if (verifiedUserId !== user_id) {
    return res.status(403).json({ success: false, error: 'Forbidden: User ID mismatch.' });
  }

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
      static_ip: req.ip || req.socket.remoteAddress || '127.0.0.1',
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

// --- START BACKTEST EXECUTION ENGINE ---
app.post('/execute/backtest', authMiddleware, async (req, res) => {
  try {
    const { strategy_id, symbol, initial_capital } = req.body;
    
    if (!strategy_id || !symbol || !initial_capital) {
      return res.status(400).json({ success: false, error: 'Missing required payload fields: strategy_id, symbol, initial_capital' });
    }

    console.log(`[BACKTEST] Running simulation for strategy ${strategy_id} on ${symbol}`);
    
    const result = await runBacktest({ strategy_id, symbol, initial_capital: Number(initial_capital) });
    
    return res.json({ success: true, ...result });
  } catch (error: any) {
    console.error(`[BACKTEST ERROR]`, error.message);
    return res.status(500).json({ success: false, error: error.message || 'Backtest failed' });
  }
});

// --- START COPY TRADING FAN-OUT EXECUTION ENGINE ---
app.post('/execute/fanout', authMiddleware, async (req, res) => {
  const { creator_id, strategy_id, symbol, action, base_qty, price, algo_id } = req.body;

  const verifiedUserId = req.headers['x-user-id'] as string;
  if (creator_id && verifiedUserId !== creator_id) {
    return res.status(403).json({ success: false, error: 'Forbidden: Creator ID mismatch.' });
  }

  if (!strategy_id || !symbol || !action || !base_qty) {
    return res.status(400).json({ success: false, error: 'Missing required payload fields.' });
  }

  try {
    // 1. Fetch all active subscribers for this strategy
    const { data: subscribers, error: subError } = await supabase
      .from('marketplace_subscriptions')
      .select('user_id, allocation_multiplier')
      .eq('strategy_id', strategy_id)
      .eq('status', 'active');

    if (subError) throw subError;

    if (!subscribers || subscribers.length === 0) {
      return res.json({ success: true, message: 'No active subscribers found for fan-out.', executions: 0 });
    }

    console.log(`[FAN-OUT] Triggered for strategy ${strategy_id}. Fanning out to ${subscribers.length} accounts.`);

    // 2. Bulk fetch Risk Profiles for all subscribers to prevent N+1 queries
    const subscriberIds = subscribers.map(s => s.user_id);
    const { data: riskProfiles } = await supabase
      .from('user_portfolio_risk')
      .select('*')
      .in('user_id', subscriberIds);
      
    const riskMap: Record<string, any> = {};
    if (riskProfiles) {
      riskProfiles.forEach(rp => { riskMap[rp.user_id] = rp; });
    }

    // 3. Prepare bulk execution array
    const executionLogs: any[] = [];

    // 4. Process each subscriber (Simulating simultaneous broker execution)
    const promises = subscribers.map(async (sub) => {
      try {
        const risk = riskMap[sub.user_id];
        let tradeStatus = 'success';
        let broker_order_id = `FAN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

        // --- RISK INTERCEPTOR: Max Daily Drawdown ---
        if (risk) {
          const totalPnl = Number(risk.today_unrealised_pnl) + Number(risk.today_realised_pnl);
          if (totalPnl <= Number(risk.max_daily_drawdown_limit)) {
            tradeStatus = 'rejected';
            broker_order_id = 'RISK_GUARD_DRAWDOWN';
            console.warn(`[RISK GUARD] Blocked trade for ${sub.user_id} due to Max Drawdown breach.`);
          }
        }

        // Calculate specific quantity based on subscriber's multiplier
        let multiplier = sub.allocation_multiplier || 1.0;
        
        // --- RISK INTERCEPTOR: Dynamic Position Sizing (Kelly Criterion) ---
        if (risk && risk.position_sizing_model === 'kelly_criterion') {
          // In a real app, calculate Kelly = W - [(1 - W) / R]. We simulate a dynamic aggressive size.
          multiplier = multiplier * 1.5; 
        }
        
        const finalQty = Math.max(1, Math.floor(base_qty * multiplier)); // Minimum 1 share

        // If rejected by risk guards, skip the actual API call
        if (tradeStatus === 'success') {
          // In production, we would fetch broker API keys here and fire the actual HTTP request to Fyers/Zerodha
          // const keys = await getBrokerKeys(sub.user_id);
        }

        // Build execution log record
        executionLogs.push({
          user_id: sub.user_id,
          strategy_id,
          symbol,
          action,
          quantity: finalQty,
          price,
          execution_type: 'live', // assuming live for copy trade
          status: tradeStatus,
          broker_order_id
        });
      } catch (err: any) {
        console.error(`[FAN-OUT ERROR] Failed for subscriber ${sub.user_id}:`, err);
        executionLogs.push({
          user_id: sub.user_id,
          strategy_id,
          symbol,
          action,
          quantity: Math.max(1, Math.floor(base_qty * (sub.allocation_multiplier || 1.0))),
          price,
          execution_type: 'live',
          status: 'failed',
          broker_order_id: 'FAN_OUT_EXECUTION_FAILED'
        });
      }
    });

    // Execute all broker API calls simultaneously
    await Promise.all(promises);

    // 4. Bulk insert logs into execution_logs table so subscribers can see it on their dashboard
    if (executionLogs.length > 0) {
      const { error: logError } = await supabase
        .from('execution_logs')
        .insert(executionLogs);

      if (logError) {
        console.error('[FAN-OUT] Error writing execution logs:', logError);
      }
    }

    return res.json({ 
      success: true, 
      message: 'Fan-out execution completed.', 
      executions: executionLogs.length 
    });

  } catch (error: any) {
    console.error('[FAN-OUT] Critical Error:', error);
    return res.status(500).json({ success: false, error: 'Internal fan-out error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '0.1.0', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Execution Engine (SEBI Compliant) running on port ${port}`);
});
