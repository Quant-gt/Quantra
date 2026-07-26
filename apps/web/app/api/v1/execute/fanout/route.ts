import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');

    const executionUrlStr = process.env.EXECUTION_SERVICE_URL || 'http://localhost:3002';
    let executionUrl;
    try {
      executionUrl = new URL(executionUrlStr);
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Invalid execution URL' }, { status: 500 });
    }

    const allowedHosts = ['localhost', '127.0.0.1'];
    // Allow internal hostnames (e.g. Docker, Kubernetes internal DNS)
    if (!allowedHosts.includes(executionUrl.hostname) && !executionUrl.hostname.endsWith('.internal') && !executionUrl.hostname.endsWith('.svc.cluster.local')) {
      return NextResponse.json({ success: false, error: 'Untrusted execution URL hostname' }, { status: 500 });
    }

    const res = await fetch(`${executionUrl.origin}/execute/fanout`, {
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
