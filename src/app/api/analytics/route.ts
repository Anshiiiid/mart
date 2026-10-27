import { NextResponse } from 'next/server';
import { getAnalyticsData } from '@/lib/store';

export async function GET() {
  try {
    const analytics = await getAnalyticsData();
    return NextResponse.json({ success: true, analytics });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
