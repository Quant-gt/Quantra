import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: scans, error } = await supabase
      .from('saved_scans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error || !scans || scans.length === 0) {
      return NextResponse.json({ scans: [], hasData: false });
    }

    // Format scans
    const formattedScans = scans.map(scan => ({
      id: scan.id,
      name: scan.scan_name,
      criteria: Array.isArray(scan.criteria) ? scan.criteria : [JSON.stringify(scan.criteria)],
      stocks: Array.isArray(scan.results) ? scan.results.length : 0,
      frequency: 'Manual',
      status: 'Idle',
      lastRun: new Date(scan.created_at).toLocaleDateString()
    }));

    return NextResponse.json({
      scans: formattedScans,
      hasData: true
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { scan_name, criteria, results } = await request.json();
    
    if (!scan_name || !criteria) {
      return NextResponse.json({ error: 'Missing scan_name or criteria' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('saved_scans')
      .insert({
        user_id: user.id,
        scan_name,
        criteria,
        results: results || []
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, scan: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing scan ID' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('saved_scans')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

