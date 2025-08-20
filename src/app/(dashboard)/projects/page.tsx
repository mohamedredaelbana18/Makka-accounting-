import { prisma } from '@/server/db/prisma';

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { startDate: 'desc' } });
  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">المشروعات</h2>
        <a className="btn" href="#">إضافة مشروع</a>
      </div>
      <table>
        <thead>
          <tr>
            <th>الكود</th>
            <th>الاسم</th>
            <th>الحالة</th>
            <th>البداية</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.id}>
              <td className="font-mono">{p.code}</td>
              <td>{p.name}</td>
              <td>{p.status}</td>
              <td>{new Date(p.startDate).toLocaleDateString('ar')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

