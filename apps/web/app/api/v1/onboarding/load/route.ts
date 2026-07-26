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

    // Allowlist approach: return only safe, non-secret fields
    if (responseData.preferences.broker_config) {
      const config = responseData.preferences.broker_config;
      responseData.preferences.broker_config = {
        app_id: config.app_id,
        api_key: config.api_key,
        client_id: config.client_id,
        redirect_uri: config.redirect_uri
      };
    }

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error('Onboarding Load Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
