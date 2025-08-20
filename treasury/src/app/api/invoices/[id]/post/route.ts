import { NextRequest, NextResponse } from 'next/server';
import { InvoiceService } from '@/server/services/invoices/InvoiceService';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { customersAccountId, suppliersAccountId, contractorsAccountId, createdBy } = await req.json();
  const type = req.nextUrl.searchParams.get('type');
  if (type === 'customer') {
    await InvoiceService.postCustomerInvoice(params.id, { customersAccountId, createdBy });
  } else if (type === 'supplier') {
    await InvoiceService.postSupplierInvoice(params.id, { suppliersAccountId, createdBy });
  } else if (type === 'contractor') {
    await InvoiceService.postContractorInvoice(params.id, { contractorsAccountId, createdBy });
  } else {
    return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

