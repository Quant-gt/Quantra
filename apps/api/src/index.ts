import express from 'express';
import { Redis } from '@upstash/redis';

const app = express();
const port = process.env.PORT || 3001;

// Redis client setup
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

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

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
