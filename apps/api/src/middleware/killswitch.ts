import express from 'express';
import redis from '../lib/redis.js';

/**
 * Middleware to check if the Kill Switch is activated.
 * SEBI compliance requires a way to immediately halt all trading.
 * Checks both global and per-user kill switches.
 */
export const killSwitchCheck = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userId = req.headers['x-user-id'] as string;

  // If Redis is not configured, skip (fallback to no kill switch)
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    return next();
  }

  try {
    // 1. Check Global Kill Switch
    const globalKill = await redis.get('killswitch:global');
    if (globalKill === 'true' || globalKill === true || globalKill === '1' || globalKill === 1) {
      return res.status(503).json({
        error: 'Global Kill Switch activated. All trading is temporarily suspended.',
        code: 'GLOBAL_KILL_SWITCH'
      });
    }

    // 2. Check User-specific Kill Switch
    if (userId) {
      const userKill = await redis.get(`killswitch:user:${userId}`);
      if (userKill === 'true' || userKill === '1') {
        return res.status(403).json({
          error: 'Your trading access has been suspended via Kill Switch.',
          code: 'USER_KILL_SWITCH'
        });
      }
    }

    next();
  } catch (error) {
    console.error('Error in killSwitchCheck middleware:', error);
    // On error, we proceed to not block trading, but log it
    next();
  }
};
