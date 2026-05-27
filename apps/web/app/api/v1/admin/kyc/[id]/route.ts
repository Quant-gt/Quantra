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

    const supabase = await createClient();

    const status = action === 'approve' ? 'approved' : 'rejected';

    const { error } = await supabase
      .from('user_kyc')
      .update({ kyc_status: status })
      .eq('user_id', id);

    if (error) throw error;

    // If approved, optionally set users.is_creator to true
    if (action === 'approve') {
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
