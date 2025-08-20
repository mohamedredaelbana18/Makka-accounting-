import { prisma } from '@/server/db/prisma';

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({ orderBy: { name: 'asc' } });
  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold">العملاء</h2>
      <table>
        <thead>
          <tr><th>الاسم</th><th>الهاتف</th><th>الرقم الضريبي</th></tr>
        </thead>
        <tbody>
          {clients.map(c => (<tr key={c.id}><td>{c.name}</td><td>{c.phone || '-'}</td><td>{c.taxId || '-'}</td></tr>))}
        </tbody>
      </table>
    </main>
  );
}

