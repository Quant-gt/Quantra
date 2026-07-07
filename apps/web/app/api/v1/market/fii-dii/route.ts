import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const fiiDiiData = [
      { pool: 'Foreign Institutional Investors (FII)', buy: 12450, sell: 11210, net: 1240 },
      { pool: 'Domestic Institutional Investors (DII)', buy: 8200, sell: 8950, net: -750 }
    ];
    return NextResponse.json({ success: true, data: fiiDiiData });
  } catch (error) {
    return NextResponse.json({ success: false, data: [] });
  }
}
