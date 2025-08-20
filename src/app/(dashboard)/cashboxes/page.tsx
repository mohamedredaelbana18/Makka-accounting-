import { prisma } from '@/server/db/prisma';

export default async function CashboxesPage() {
  const cashboxes = await prisma.cashbox.findMany({ include: { project: true } });
  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">الخزائن</h2>
        <a className="btn" href="#">تحويل بين الخزن</a>
      </div>
      <table>
        <thead>
          <tr>
            <th>الكود</th>
            <th>الاسم</th>
            <th>المشروع</th>
          </tr>
        </thead>
        <tbody>
          {cashboxes.map(c => (
            <tr key={c.id}>
              <td className="font-mono">{c.code}</td>
              <td>{c.name}</td>
              <td>{c.project?.name || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

