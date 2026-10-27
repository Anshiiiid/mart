import { NextResponse } from 'next/server';
import { getAllOrders, createOrder } from '@/lib/store';

export async function GET() {
  try {
    const orders = await getAllOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.customerName || !body.customerPhone || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Customer information and items are required' },
        { status: 400 }
      );
    }

    const order = await createOrder({
      customerName: body.customerName,
      customerEmail: body.customerEmail || 'guest@hatkehaat.com',
      customerPhone: body.customerPhone,
      shippingAddress: body.shippingAddress || {
        street: 'Panampilly Nagar',
        city: 'Kochi',
        state: 'Kerala',
        pincode: '682036',
      },
      items: body.items,
      subtotal: Number(body.subtotal || 0),
      discount: Number(body.discount || 0),
      paymentMethod: body.paymentMethod || 'UPI',
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create order', details: String(error) },
      { status: 500 }
    );
  }
}
