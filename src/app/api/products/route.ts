import { NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const products = await getAllProducts(category);
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Name, price, and category are required' },
        { status: 400 }
      );
    }

    const newProduct = await createProduct({
      name: body.name,
      nameMl: body.nameMl || '',
      category: body.category,
      categorySlug: body.categorySlug || body.category.toLowerCase().replace(/\s+/g, '-'),
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      discountPercent: body.discountPercent ? Number(body.discountPercent) : 0,
      rating: Number(body.rating || 5.0),
      reviewCount: Number(body.reviewCount || 1),
      image: body.image || '/products/airfryer.jpg',
      description: body.description || '',
      descriptionMl: body.descriptionMl || '',
      features: Array.isArray(body.features) ? body.features : [],
      specs: body.specs || {},
      stock: Number(body.stock || 10),
      isFeatured: Boolean(body.isFeatured),
      is3dAvailable: Boolean(body.is3dAvailable),
      traditionalArtTag: body.traditionalArtTag || 'Indian Craft',
      tags: Array.isArray(body.tags) ? body.tags : ['Handmade'],
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create product', details: String(error) },
      { status: 500 }
    );
  }
}
