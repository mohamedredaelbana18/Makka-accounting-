import { NextRequest, NextResponse } from 'next/server';
import { VoucherService } from '@/server/services/vouchers/VoucherService';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { kind } = body;
  if (kind === 'receipt') {
    const res = await VoucherService.receipt({ ...body, date: new Date(body.date) });
    return NextResponse.json(res);
  }
  if (kind === 'payment') {
    const res = await VoucherService.payment({ ...body, date: new Date(body.date) });
    return NextResponse.json(res);
  }
  if (kind === 'transfer') {
    const res = await VoucherService.transfer({ ...body, date: new Date(body.date) });
    return NextResponse.json(res);
  }
  return NextResponse.json({ error: 'unknown kind' }, { status: 400 });
}

