import { prisma } from '@/server/db/prisma';
import { VoucherService } from '@/server/services/vouchers/VoucherService';

async function receipt(form: FormData) {
  'use server';
  const amount = Number(form.get('amount') || 0);
  const cashboxAccountId = String(form.get('cashboxAccountId'));
  await VoucherService.receipt({ date: new Date(), amount, cashboxAccountId, createdBy: 'web' });
}

export default async function VouchersPage() {
  const cashAccounts = await prisma.account.findMany({ where: { code: { startsWith: '10' } } });
  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold">السندات</h2>
      <form action={receipt} className="flex items-end gap-2">
        <label className="flex flex-col"><span className="text-sm">القيمة</span><input name="amount" type="number" step="0.01" className="border rounded px-3 py-2" /></label>
        <label className="flex flex-col">
          <span className="text-sm">خزنة</span>
          <select name="cashboxAccountId" className="border rounded px-3 py-2">
            {cashAccounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </label>
        <button className="btn">سند قبض</button>
      </form>
    </main>
  );
}

