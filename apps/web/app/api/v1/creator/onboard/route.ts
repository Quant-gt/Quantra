import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { pan_number, is_ria, sebi_registration_number } = body;

    // Validate request
    if (!pan_number || pan_number.length !== 10) {
      return NextResponse.json({ error: 'Invalid PAN number format.' }, { status: 400 });
    }

    if (is_ria && !sebi_registration_number) {
      return NextResponse.json({ error: 'SEBI Registration number is required for RIAs.' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const updateData: any = {
        ra_license_no: sebi_registration_number || null,
        ra_verified: false
      };
      
      if (sebi_registration_number) {
        updateData.ra_expiry_date = new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString();
      }

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating SEBI compliance on user:', error);
        return NextResponse.json({ error: 'Failed to update compliance details.' }, { status: 500 });
      }

      // We must save PAN and KYC status in user_metadata because the user_kyc table doesn't exist
      // We will use the admin client to securely update user_metadata
      const { createClient: createAdminClient } = await import('@supabase/supabase-js');
      const adminAuthClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      await adminAuthClient.auth.admin.updateUserById(user.id, {
        user_metadata: {
          ...user.user_metadata,
          kyc_status: 'pending',
          pan_number: pan_number,
          is_ria: is_ria,
          sebi_registration_number: sebi_registration_number
        }
      });
    }

    // Simulate backend processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json({
      success: true,
      message: 'KYC Application submitted successfully. Pending verification.',
      data: {
        pan_number,
        is_ria,
        sebi_registration_number,
        kyc_status: 'pending'
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
