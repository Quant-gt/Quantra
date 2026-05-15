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
  const userId = req.headers['x-user-id'] as string;

  if (!userId) {
    return res.status(401).json({ error: 'Missing x-user-id header for authentication' });
  }

  try {
    // Get current time in IST
    const now = new Date();
    const istDateStr = now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour12: false });
    const [datePart, timePart] = istDateStr.split(', ');
    const [hours, minutes] = timePart.split(':').map(Number);

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
    const last2faIst = last2fa.toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour12: false });
    const [last2faDatePart] = last2faIst.split(', ');

    if (datePart !== last2faDatePart) {
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
