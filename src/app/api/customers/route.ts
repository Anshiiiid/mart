import { NextResponse } from 'next/server';
import { getAllCustomers } from '@/lib/store';

export async function GET() {
  try {
    const customers = await getAllCustomers();
    return NextResponse.json({ success: true, customers });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
