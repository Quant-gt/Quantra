import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');

    const executionUrl = process.env.EXECUTION_SERVICE_URL || 'http://localhost:3002';

    const res = await fetch(`${executionUrl}/execute/fanout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {})
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error('Execution fanout proxy error:', error);
    return NextResponse.json({ success: false, error: 'Execution engine is offline or unreachable' }, { status: 502 });
  }
}
