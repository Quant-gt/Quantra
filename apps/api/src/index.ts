import express from 'express';
import redis from './lib/redis.ts';
import { dailyAuthCheck } from './middleware/auth.ts';
import { opsMonitor } from './middleware/ops.ts';
import { killSwitchCheck } from './middleware/killswitch.ts';

const app = express();
const port = process.env.PORT || 3001;

// Middleware for brute-force rate limiting using Upstash Redis
const rateLimiter = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!process.env.UPSTASH_REDIS_REST_URL) return next();

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const key = `ratelimit_${ip}`;

  try {
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, 60); // 1 minute window
    }

    if (current > 100) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
    next();
  } catch (error) {
    next();
  }
};

app.use(rateLimiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '0.1.0', timestamp: new Date().toISOString() });
});

// Auth webhook for logging login activity
app.post('/webhook/auth', express.json(), async (req, res) => {
  const { user_id, event, ip_address, user_agent } = req.body;
  
  if (event === 'SIGNED_IN') {
    // Ideally log to users_sessions table in Supabase
    console.log(`User ${user_id} signed in from ${ip_address} using ${user_agent}`);
  }
  
  res.json({ success: true });
});

// Protected route for strategy deployment (SEBI Compliance Check)
app.post('/api/strategy/deploy', killSwitchCheck, dailyAuthCheck, express.json(), async (req, res) => {
  res.json({
    success: true,
    message: 'Strategy deployment authorized. All SEBI daily compliance checks passed.'
  });
});
// Protected route for order placement (SEBI OPS Check)
app.post('/api/trade/place', killSwitchCheck, opsMonitor, express.json(), async (req, res) => {
  res.json({
    success: true,
    message: 'Order placed successfully. OPS limits respected.'
  });
});
// Admin route to trigger Kill Switch (SEBI Compliance)
app.post('/api/admin/killswitch', express.json(), async (req, res) => {
  const { action, userId } = req.body;

  if (!action || !['activate', 'deactivate'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action. Must be activate or deactivate.' });
  }

  const isActivate = action === 'activate';
  const value = isActivate ? 'true' : 'false';

  try {
    if (userId) {
      // User-specific kill switch
      await redis.set(`killswitch:user:${userId}`, value);
      await redis.publish('killswitch', JSON.stringify({ target: 'user', userId, action }));
    } else {
      // Global kill switch
      await redis.set('killswitch:global', value);
      await redis.publish('killswitch', JSON.stringify({ target: 'global', action }));
    }

    res.json({
      success: true,
      message: `Kill switch ${action}d successfully.`,
      target: userId ? `user:${userId}` : 'global'
    });
  } catch (error) {
    console.error('Error triggering kill switch:', error);
    res.status(500).json({ error: 'Failed to trigger kill switch' });
  }
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});

