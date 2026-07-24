import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body; // 'approve' | 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const { createClient: createAdminClient } = await import('@supabase/supabase-js');
    const adminAuthClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const status = action === 'approve' ? 'approved' : 'rejected';

    const { data: userData, error: fetchError } = await adminAuthClient.auth.admin.getUserById(id);
    if (fetchError) throw fetchError;

    const { error: updateError } = await adminAuthClient.auth.admin.updateUserById(id, {
      user_metadata: {
        ...userData.user.user_metadata,
        kyc_status: status
      }
    });

    if (updateError) throw updateError;

    // If approved, optionally set users.is_creator to true
    if (action === 'approve') {
      const supabase = await createClient();
      await supabase
        .from('users')
        .update({ is_creator: true })
        .eq('id', id);
    }

    return NextResponse.json({
      success: true,
      message: `KYC application ${id} has been ${status}.`
    });
  } catch (error) {
    console.error('Error processing KYC action:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
