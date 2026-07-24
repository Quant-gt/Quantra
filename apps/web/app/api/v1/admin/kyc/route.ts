import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { createClient: createAdminClient } = await import('@supabase/supabase-js');
    const adminAuthClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: authData, error: authError } = await adminAuthClient.auth.admin.listUsers();
    
    if (authError) throw authError;

    // Filter users whose kyc_status in raw_user_meta_data is 'pending'
    const pendingUsers = authData.users.filter(u => u.user_metadata?.kyc_status === 'pending');

    const requests = pendingUsers.map(user => ({
      id: user.id,
      user_name: user.user_metadata?.full_name || 'Unknown User',
      email: user.email || 'No email provided',
      pan_number: user.user_metadata?.pan_number || 'N/A',
      is_ria: user.user_metadata?.is_ria || false,
      sebi_registration_number: user.user_metadata?.sebi_registration_number || null,
      status: user.user_metadata?.kyc_status,
      submitted_at: user.updated_at || user.created_at
    }));

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Error fetching KYC requests:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
