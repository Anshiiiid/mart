import { NextResponse } from 'next/server';
import { updateProductStock } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const { id, delta } = await request.json();
    if (!id || typeof delta !== 'number') {
      return NextResponse.json({ success: false, error: 'Product ID and delta are required' }, { status: 400 });
    }

    const updated = await updateProductStock(id, delta);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
