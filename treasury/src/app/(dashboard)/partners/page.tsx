import { prisma } from '@/server/db/prisma';

export default async function PartnersPage() {
  const rows = await prisma.projectPartner.findMany({ include: { partner: true, project: true } });
  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold">الشركاء والمحافظ</h2>
      <table>
        <thead>
          <tr>
            <th>المشروع</th>
            <th>الشريك</th>
            <th>المحفظة</th>
            <th>الرصيد السابق</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.project.name}</td>
              <td>{r.partner.name}</td>
              <td className="font-mono">{r.walletAccountId}</td>
              <td>{Number(r.previousCarry).toLocaleString('ar')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

