import { NextRequest } from 'next/server';
import { ExportService } from '@/server/services/export/ExportService';
import { prisma } from '@/server/db/prisma';

export async function GET(req: NextRequest, { params }: { params: { entity: string } }) {
  const entity = params.entity;
  let columns: string[] = [];
  let rows: (string | number)[][] = [];

  if (entity === 'invoices') {
    const data = await prisma.invoice.findMany({ include: { project: true }, orderBy: { date: 'desc' } });
    columns = ['الرقم', 'التاريخ', 'المشروع', 'النوع', 'الإجمالي', 'الحالة'];
    rows = data.map((inv) => [inv.number, new Date(inv.date).toLocaleDateString('ar'), inv.project.name, inv.type, Number(inv.total), inv.status]);
  }

  const buf = await ExportService.toExcel({ columns, rows, title: entity });
  return new Response(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${entity}.xlsx"`,
    },
  });
}

