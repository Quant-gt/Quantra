import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { pan_number, expected_name } = body;

    // Simulate network delay to NSDL / Income Tax Dept servers
    await new Promise(resolve => setTimeout(resolve, 1200));

    // MOCK LOGIC: We simulate a successful verification for one user, and a mismatch for another
    // In production, this would call a paid API like Cashfree or Setu
    let fetchedName = '';

    if (pan_number === 'BIVPB8534F') {
      fetchedName = 'RAHUL SHARMA'; // Matches "Rahul Sharma"
    } else if (pan_number === 'CDPPA1234Q') {
      fetchedName = 'PRIYANKA PATEL'; // Mismatch with "Priya Patel"
    } else {
      fetchedName = expected_name.toUpperCase(); // Default to match for testing
    }

    // Simple string similarity check (exact match ignoring case for this mock)
    const isMatch = fetchedName.toLowerCase() === expected_name.toLowerCase();

    return NextResponse.json({
      success: true,
      data: {
        pan_number,
        registered_name: fetchedName,
        is_match: isMatch,
        message: isMatch 
          ? 'PAN matched successfully.' 
          : `Name mismatch. NSDL returned: ${fetchedName}`
      }
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
