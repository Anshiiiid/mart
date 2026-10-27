import { NextResponse } from 'next/server';
import { getAllCategories, updateCategory, reorderCategories } from '@/lib/store';

export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === 'reorder' && Array.isArray(body.orderedIds)) {
      const updated = await reorderCategories(body.orderedIds);
      return NextResponse.json({ success: true, categories: updated });
    }

    if (body.id) {
      const updated = await updateCategory(body.id, body.updates);
      return NextResponse.json({ success: true, category: updated });
    }

    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update category', details: String(error) },
      { status: 500 }
    );
  }
}
