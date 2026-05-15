import express from 'express';
import redis from '../lib/redis.ts';

/**
 * Middleware to monitor and throttle Orders Per Second (OPS).
 * SEBI mandate requires staying below 10 OPS without HFT registration.
 */
export const opsMonitor = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userId = req.headers['x-user-id'] as string;
  // Assume exchange is passed in header or body, default to 'NSE' for safety
  const exchange = (req.headers['x-exchange'] as string) || (req.body && req.body.exchange) || 'NSE';

  if (!userId) {
    return res.status(401).json({ error: 'Missing x-user-id header for OPS check' });
  }

  // If Redis is not configured, skip (fallback to no limit)
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    return next();
  }

  try {
    // Get current timestamp in seconds
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const key = `ops:${userId}:${exchange}:${nowInSeconds}`;

    // Increment count for this second
    const currentOps = await redis.incr(key);

    if (currentOps === 1) {
      // Set expiry to 2 seconds so the key cleans up automatically
      await redis.expire(key, 2);
    }

    // SEBI limit is 10 OPS
    if (currentOps > 10) {
      console.warn(`OPS Limit Exceeded for user ${userId} on ${exchange}: ${currentOps} ops`);
      return res.status(429).json({
        error: `SEBI 10 Orders Per Second limit exceeded on ${exchange}. Throttled.`,
        code: 'OPS_LIMIT_EXCEEDED',
        current_ops: currentOps
      });
    }

    // Also update the current_ops in the request object for logging or dashboard
    // (Optional: we can attach it to req if needed)

    next();
  } catch (error) {
    console.error('Error in opsMonitor middleware:', error);
    // On error, we proceed to not block trading, but log it
    next();
  }
};
