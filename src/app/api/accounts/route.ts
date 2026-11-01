import { NextResponse } from 'next/server';
import {
  getFinancialSummary,
  getAllExpenses,
  createExpense,
  deleteExpense,
  getPayoutSettlements,
} from '@/lib/store';

export async function GET() {
  try {
    const [summary, expenses, payouts] = await Promise.all([
      getFinancialSummary(),
      getAllExpenses(),
      getPayoutSettlements(),
    ]);

    return NextResponse.json({
      success: true,
      summary,
      expenses,
      payouts,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch accounts data', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create_expense') {
      const newExpense = await createExpense({
        title: body.title,
        category: body.category,
        amount: Number(body.amount),
        date: body.date || new Date().toISOString().split('T')[0],
        paymentMode: body.paymentMode || 'UPI',
        notes: body.notes || '',
      });
      return NextResponse.json({ success: true, expense: newExpense });
    }

    if (action === 'delete_expense') {
      await deleteExpense(body.id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Unknown accounts action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Accounts action failed', details: String(error) },
      { status: 500 }
    );
  }
}
