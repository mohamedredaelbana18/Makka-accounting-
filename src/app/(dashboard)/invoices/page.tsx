import { prisma } from '@/server/db/prisma';

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({ include: { project: true }, orderBy: { date: 'desc' } });
  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold">الفواتير</h2>
      <div>
        <a className="btn-outline" href="/api/export/invoices/excel" target="_blank">تصدير Excel</a>
        <a className="btn-outline ml-2" href="/api/export/invoices/pdf" target="_blank">طباعة PDF</a>
      </div>
      <table>
        <thead>
          <tr>
            <th>الرقم</th>
            <th>التاريخ</th>
            <th>المشروع</th>
            <th>النوع</th>
            <th>الإجمالي</th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(inv => (
            <tr key={inv.id}>
              <td className="font-mono">{inv.number}</td>
              <td>{new Date(inv.date).toLocaleDateString('ar')}</td>
              <td>{inv.project.name}</td>
              <td>{inv.type}</td>
              <td>{Number(inv.total).toLocaleString('ar')}</td>
              <td>{inv.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

