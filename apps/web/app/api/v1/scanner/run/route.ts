import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { scanner_config_id, filter_graph, universe_id, filters } = body;
    
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Proxy request to the Python backend (FastAPI)
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
    
    const backendResponse = await fetch(`${backendUrl}/api/v1/scanner/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        universe_id: universe_id || 'Nifty 50',
        filters: filters || filter_graph || {}
      })
    });

    if (!backendResponse.ok) {
      throw new Error(`Backend scanner failed with status: ${backendResponse.status}`);
    }

    const data = await backendResponse.json();
    
    // The backend conforms to the OpenAPI spec: { scan_id, results: [...] }
    return NextResponse.json({ success: true, ...data });

  } catch (error: any) {
    console.error('Scanner Proxy Error:', error);
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
