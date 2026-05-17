import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Initialize Supabase Service Client (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * @route POST /api/v1/creator/onboard
 * @desc Onboards a user as a Creator, collecting their PAN and SEBI details for KYC.
 * @access Protected (Requires dailyAuthCheck)
 */
router.post('/onboard', async (req, res) => {
  try {
    // x-user-id is set by the dailyAuthCheck middleware
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. User ID missing.' });
    }

    const { pan_number, sebi_registration_number, is_ria } = req.body;

    // 1. Strict Compliance Checks
    if (!pan_number || pan_number.trim().length !== 10) {
      return res.status(400).json({ error: 'A valid 10-character PAN Number is required for SEBI compliance.' });
    }

    if (is_ria && (!sebi_registration_number || sebi_registration_number.trim().length === 0)) {
      return res.status(400).json({ error: 'SEBI Registration Number is required if you are registering as an RIA.' });
    }

    // 2. Update `users` table to set them as a creator and attach PAN
    const { error: userError } = await supabase
      .from('users')
      .update({ 
        pan_number: pan_number.toUpperCase().trim(), 
        is_creator: true 
      })
      .eq('id', userId);

    if (userError) {
      // 23505 is the PostgreSQL code for a UNIQUE constraint violation
      if (userError.code === '23505') { 
        return res.status(409).json({ error: 'This PAN Number is already registered to another account.' });
      }
      throw userError;
    }

    // 3. Upsert into `user_kyc` table for backend verification queue
    const { error: kycError } = await supabase
      .from('user_kyc')
      .upsert({ 
        user_id: userId, 
        sebi_registration_number: is_ria ? sebi_registration_number.trim().toUpperCase() : null,
        is_ria: !!is_ria,
        kyc_status: 'pending' 
      }, { onConflict: 'user_id' });

    if (kycError) {
      throw kycError;
    }

    // Success response
    res.status(200).json({
      success: true,
      message: 'Creator profile successfully initialized. KYC is pending verification.',
    });

  } catch (error: any) {
    console.error('[API] Creator Onboarding Error:', error);
    res.status(500).json({ error: 'Internal Server Error during KYC processing.' });
  }
});

export default router;
