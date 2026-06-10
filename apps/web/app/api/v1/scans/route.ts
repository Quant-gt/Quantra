import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set({ name, value, ...options }); } catch (e) {}
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set({ name, value: '', ...options }); } catch (e) {}
        },
      },
    }
  );

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
}
