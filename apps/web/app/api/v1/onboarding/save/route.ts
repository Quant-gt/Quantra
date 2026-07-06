import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { encrypt } from '@/lib/crypto';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentStep, data } = await request.json();

    if (currentStep === undefined || !data) {
      return NextResponse.json({ error: 'Missing step or data parameters' }, { status: 400 });
    }

    // Process and encrypt sensitive broker config credentials on the server
    const processedData = { ...data };
    if (processedData.broker_config) {
      const config = { ...processedData.broker_config };
      
      // Encrypt sensitive fields if present
      if (config.app_secret) config.app_secret = encrypt(config.app_secret);
      if (config.api_secret) config.api_secret = encrypt(config.api_secret);
      if (config.totp_secret) config.totp_secret = encrypt(config.totp_secret);
      if (config.mpin) config.mpin = encrypt(config.mpin);
      
      processedData.broker_config = config;
    }

    const { error } = await supabase
      .from('users')
      .update({
        profile_wizard_step: currentStep,
        preferences: processedData
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error saving onboarding data:', error);
      return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Onboarding Save Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
