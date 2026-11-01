import { NextResponse } from 'next/server';
import {
  getAllCoupons,
  createCoupon,
  toggleCoupon,
  deleteCoupon,
  getAllCampaigns,
  createCampaign,
  getWhatsAppTemplates,
  getAnnouncementBanner,
  updateAnnouncementBanner,
} from '@/lib/store';

export async function GET() {
  try {
    const [coupons, campaigns, whatsappTemplates, banner] = await Promise.all([
      getAllCoupons(),
      getAllCampaigns(),
      getWhatsAppTemplates(),
      getAnnouncementBanner(),
    ]);

    return NextResponse.json({
      success: true,
      coupons,
      campaigns,
      whatsappTemplates,
      banner,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch marketing data', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create_coupon') {
      const newCoupon = await createCoupon({
        code: body.code,
        discountType: body.discountType,
        discountValue: Number(body.discountValue),
        minOrderValue: Number(body.minOrderValue || 0),
        usageLimit: Number(body.usageLimit || 100),
        expiresAt: body.expiresAt || '2026-12-31',
        isActive: true,
        description: body.description || '',
      });
      return NextResponse.json({ success: true, coupon: newCoupon });
    }

    if (action === 'toggle_coupon') {
      const updated = await toggleCoupon(body.id);
      return NextResponse.json({ success: true, coupon: updated });
    }

    if (action === 'delete_coupon') {
      await deleteCoupon(body.id);
      return NextResponse.json({ success: true });
    }

    if (action === 'update_banner') {
      const banner = await updateAnnouncementBanner(body.banner);
      return NextResponse.json({ success: true, banner });
    }

    if (action === 'create_campaign') {
      const campaign = await createCampaign({
        name: body.name,
        channel: body.channel,
        status: 'Active',
        budget: Number(body.budget || 0),
        spent: 0,
        revenue: 0,
        roas: 0,
        clicks: 0,
        conversions: 0,
      });
      return NextResponse.json({ success: true, campaign });
    }

    return NextResponse.json({ success: false, error: 'Unknown marketing action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Marketing action failed', details: String(error) },
      { status: 500 }
    );
  }
}
