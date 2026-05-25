import { NextResponse } from 'next/server';

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

    // Since this is a demo environment with mocked auth, we will simulate a successful insertion
    // into the user_kyc table without hitting Supabase (because auth.uid() would fail).

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
