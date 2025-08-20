import { prisma } from '@/server/db/prisma';

export default async function ContractorsPage() {
  const contractors = await prisma.contractor.findMany({ include: { contracts: true } });
  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold">المقاولون</h2>
      <table>
        <thead>
          <tr>
            <th>الاسم</th>
            <th>عدد العقود</th>
          </tr>
        </thead>
        <tbody>
          {contractors.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.contracts.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

