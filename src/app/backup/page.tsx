import { prisma } from '@/server/db/prisma';

async function runManual() {
  'use server';
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/backup/run`, { method: 'POST' });
}

export default async function BackupPage() {
  const backups = await prisma.backup.findMany({ orderBy: { runAt: 'desc' }, take: 20 });
  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">النسخ الاحتياطي</h2>
        <form action={runManual}><button className="btn">تنفيذ نسخة الآن</button></form>
      </div>
      <table>
        <thead>
          <tr>
            <th>التاريخ</th>
            <th>المكان</th>
            <th>الحالة</th>
            <th>المسار/المعرف</th>
            <th>الحجم</th>
          </tr>
        </thead>
        <tbody>
          {backups.map(b => (
            <tr key={b.id}>
              <td>{new Date(b.runAt).toLocaleString('ar')}</td>
              <td>{b.location}</td>
              <td>{b.status}</td>
              <td className="truncate max-w-[320px]" title={b.pathOrDriveId}>{b.pathOrDriveId}</td>
              <td>{b.sizeBytes || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

