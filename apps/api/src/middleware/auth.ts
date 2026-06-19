import express from 'express';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Note: In production, use environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Middleware to check if the user's daily OAuth session is valid.
 * According to SEBI 2026 mandate, sessions expire at 16:05 IST daily.
 */
export const dailyAuthCheck = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const userId = user.id;
    req.headers['x-user-id'] = userId; // Set verified user ID for downstream middlewares
    // Get current time in IST using a robust timezone-agnostic calculation
    const now = new Date();
    const getIstDateComponents = (date: Date) => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      });
      const parts = formatter.formatToParts(date);
      const components: Record<string, number> = {};
      for (const part of parts) {
        if (part.type !== 'literal') {
          components[part.type] = parseInt(part.value, 10);
        }
      }
      return {
        year: components.year || date.getFullYear(),
        month: (components.month ? components.month - 1 : date.getMonth()),
        day: components.day || date.getDate(),
        hours: components.hour === 24 ? 0 : (components.hour || 0),
        minutes: components.minute || 0,
      };
    };

    const nowIst = getIstDateComponents(now);
    const hours = nowIst.hours;
    const minutes = nowIst.minutes;

    // 1. Check if current time is past 16:05 IST
    if (hours > 16 || (hours === 16 && minutes >= 5)) {
      return res.status(403).json({
        error: 'Daily session expired at 16:05 IST. Please re-authenticate tomorrow.',
        code: 'SESSION_EXPIRED_TIME'
      });
    }

    // 2. Query Supabase for the user's subscription/session status
    const { data, error } = await supabase
      .from('marketplace_subscriptions')
      .select('status, last_daily_2fa_at, session_valid_until')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error || !data) {
      return res.status(403).json({
        error: 'No active session found or daily auth expired.',
        code: 'NO_ACTIVE_SESSION'
      });
    }

    // 3. Check if last 2FA was today
    const last2fa = new Date(data.last_daily_2fa_at);
    const last2faIst = getIstDateComponents(last2fa);

    if (
      nowIst.year !== last2faIst.year ||
      nowIst.month !== last2faIst.month ||
      nowIst.day !== last2faIst.day
    ) {
      return res.status(403).json({
        error: 'Daily 2FA authentication required for today.',
        code: 'MANDATORY_DAILY_2FA'
      });
    }

    // 4. Check if session_valid_until is in the future
    const validUntil = new Date(data.session_valid_until);
    if (validUntil < now) {
      return res.status(403).json({
        error: 'Session validity period has expired.',
        code: 'SESSION_EXPIRED_VALIDITY'
      });
    }

    // If all checks pass, proceed
    next();
  } catch (error) {
    console.error('Error in dailyAuthCheck middleware:', error);
    res.status(500).json({ error: 'Internal server error during compliance check' });
  }
};

/**
 * Middleware to check if the authenticated user has admin privileges.
 * Must be used after dailyAuthCheck to ensure x-user-id is set.
 */
export const adminOnly = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userId = req.headers['x-user-id'] as string;
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized. User ID missing.' });
  }

  const adminIds = (process.env.ADMIN_USER_IDS || '').split(',').map(id => id.trim());
  
  if (!adminIds.includes(userId)) {
    return res.status(403).json({ error: 'Forbidden. Admin privileges required.' });
  }

  next();
};
