import { prisma } from '@/server/db/prisma';
import { SettlementService } from '@/server/services/settlement/SettlementService';

async function execute(data: FormData) {
  'use server';
  const projectId = String(data.get('projectId'));
  await SettlementService.executeSettlement(projectId, { date: new Date(), createdBy: 'web' });
}

export default async function SettlementPage() {
  const projects = await prisma.project.findMany();
  const first = projects[0];
  const preview = first ? await SettlementService.computeContributions(first.id) : [];
  return (
    <main className="space-y-4">
      <h2 className="text-xl font-semibold">تسوية الشركاء</h2>
      <form action={execute} className="flex gap-2 items-end">
        <label className="flex flex-col">
          <span className="text-sm">المشروع</span>
          <select name="projectId" className="border rounded-md px-3 py-2">
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
        <button className="btn">تنفيذ التسوية</button>
      </form>
      {first && (
        <div className="space-y-2">
          <div className="text-sm text-gray-500">مساهمات المشروع: {first.name}</div>
          <table>
            <thead>
              <tr><th>الشريك</th><th>مدفوع</th><th>مستلم</th><th>صافي</th></tr>
            </thead>
            <tbody>
              {preview.map((c: any) => (
                <tr key={c.partnerId}>
                  <td className="font-mono">{c.partnerId}</td>
                  <td>{c.paid}</td>
                  <td>{c.received}</td>
                  <td>{c.net}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

