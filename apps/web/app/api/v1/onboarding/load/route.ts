import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from('users')
      .select('profile_wizard_step, preferences, roles, current_view, experience_level, preferred_language')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching onboarding profile:', error);
      return NextResponse.json({ error: 'Failed to retrieve profile' }, { status: 500 });
    }

    const responseData = {
      profile_wizard_step: profile.profile_wizard_step || 0,
      preferences: { ...profile.preferences }
    };

    // Mask sensitive encrypted broker keys on retrieval for browser safety
    if (responseData.preferences.broker_config) {
      const config = { ...responseData.preferences.broker_config };
      if (config.app_secret) config.app_secret = '••••••••••••';
      if (config.api_secret) config.api_secret = '••••••••••••';
      if (config.totp_secret) config.totp_secret = '••••••••••••';
      if (config.mpin) config.mpin = '••••••';
      
      responseData.preferences.broker_config = config;
    }

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error('Onboarding Load Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
