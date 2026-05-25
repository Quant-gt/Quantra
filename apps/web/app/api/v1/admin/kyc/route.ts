import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: kycData, error } = await supabase
      .from('user_kyc')
      .select(`
        user_id,
        pan_number,
        is_ria,
        sebi_registration_number,
        kyc_status,
        users:user_id (full_name, email)
      `)
      .eq('kyc_status', 'pending');

    if (error) throw error;

    // Transform data to match UI expectations
    const requests = kycData.map((row: any) => ({
      id: row.user_id,
      user_name: row.users?.full_name || 'Unknown User',
      email: row.users?.email || 'No email provided',
      pan_number: row.pan_number,
      is_ria: row.is_ria,
      sebi_registration_number: row.sebi_registration_number,
      status: row.kyc_status,
      submitted_at: new Date().toISOString() // Or fetch from a created_at column if added
    }));

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Error fetching KYC requests:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
