import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Accounts tree
  const cashRoot = await prisma.account.upsert({ where: { code: '1000' }, update: {}, create: { code: '1000', name: 'النقدية وما في حكمها', type: 'asset' } });
  const customers = await prisma.account.upsert({ where: { code: '1100' }, update: {}, create: { code: '1100', name: 'العملاء', type: 'asset' } });
  const suppliers = await prisma.account.upsert({ where: { code: '2100' }, update: {}, create: { code: '2100', name: 'الموردون', type: 'liability' } });
  const contractors = await prisma.account.upsert({ where: { code: '2200' }, update: {}, create: { code: '2200', name: 'المقاولون', type: 'liability' } });
  const revenue = await prisma.account.upsert({ where: { code: '4000' }, update: {}, create: { code: '4000', name: 'الإيرادات', type: 'revenue' } });
  const expense = await prisma.account.upsert({ where: { code: '5000' }, update: {}, create: { code: '5000', name: 'المصروفات', type: 'expense' } });

  // Projects
  const [p1, p2, p3] = await Promise.all([
    prisma.project.upsert({ where: { code: 'PRJ-001' }, update: {}, create: { code: 'PRJ-001', name: 'مشروع مبنى إداري', status: 'active', startDate: new Date() } }),
    prisma.project.upsert({ where: { code: 'PRJ-002' }, update: {}, create: { code: 'PRJ-002', name: 'مشروع طريق', status: 'paused', startDate: new Date() } }),
    prisma.project.upsert({ where: { code: 'PRJ-003' }, update: {}, create: { code: 'PRJ-003', name: 'مشروع فيلا', status: 'closed', startDate: new Date() } }),
  ]);

  // Cashboxes
  const c1acc = await prisma.account.create({ data: { code: '1010', name: 'خزنة رئيسية', type: 'asset', parentAccountId: cashRoot.id } });
  const c2acc = await prisma.account.create({ data: { code: '1011', name: 'خزنة فرعية', type: 'asset', parentAccountId: cashRoot.id } });
  const c3acc = await prisma.account.create({ data: { code: '1012', name: 'خزنة مشروع PRJ-002', type: 'asset', parentAccountId: cashRoot.id } });
  await prisma.cashbox.createMany({ data: [
    { code: 'CB-1', name: 'خزنة 1', accountId: c1acc.id, projectId: p1.id },
    { code: 'CB-2', name: 'خزنة 2', accountId: c2acc.id, projectId: p1.id },
    { code: 'CB-3', name: 'خزنة 3', accountId: c3acc.id, projectId: p2.id },
  ]});

  // Clients/Suppliers
  await prisma.client.createMany({ data: [
    { name: 'عميل 1' }, { name: 'عميل 2' }, { name: 'عميل 3' }, { name: 'عميل 4' }
  ]});
  await prisma.supplier.createMany({ data: [
    { name: 'مورد 1' }, { name: 'مورد 2' }, { name: 'مورد 3' }, { name: 'مورد 4' }
  ]});

  // Partners and project partners
  const [pa, pb, pc] = await prisma.$transaction([
    prisma.partner.create({ data: { name: 'شريك 1' } }),
    prisma.partner.create({ data: { name: 'شريك 2' } }),
    prisma.partner.create({ data: { name: 'شريك 3' } }),
  ]);
  const [w1, w2, w3] = await Promise.all([
    prisma.account.create({ data: { code: '3101', name: 'محفظة شريك 1', type: 'equity' } }),
    prisma.account.create({ data: { code: '3102', name: 'محفظة شريك 2', type: 'equity' } }),
    prisma.account.create({ data: { code: '3103', name: 'محفظة شريك 3', type: 'equity' } }),
  ]);
  await prisma.projectPartner.createMany({ data: [
    { projectId: p1.id, partnerId: pa.id, walletAccountId: w1.id, previousCarry: 0 },
    { projectId: p1.id, partnerId: pb.id, walletAccountId: w2.id, previousCarry: 0 },
    { projectId: p1.id, partnerId: pc.id, walletAccountId: w3.id, previousCarry: 0 },
  ]});

  // Materials & moves
  const [m1, m2] = await Promise.all([
    prisma.material.create({ data: { name: 'أسمنت', unit: 'طن', defaultUnitCost: 1000 } }),
    prisma.material.create({ data: { name: 'حديد', unit: 'طن', defaultUnitCost: 3000 } }),
  ]);
  await prisma.projectMaterialMove.createMany({ data: [
    { projectId: p1.id, materialId: m1.id, type: 'in', qty: 10, unitCost: 950, date: new Date() },
    { projectId: p1.id, materialId: m2.id, type: 'out', qty: 2, unitCost: 3200, date: new Date() },
  ]});

  // Invoices
  const inv1 = await prisma.invoice.create({ data: {
    projectId: p1.id, type: 'customer', number: 'INV-C-001', date: new Date(), total: 5000, status: 'draft',
    lines: { create: [{ description: 'بيع مادة', qty: 5, unitPrice: 1000, accountId: revenue.id }] }
  }});
  const inv2 = await prisma.invoice.create({ data: {
    projectId: p1.id, type: 'supplier', number: 'INV-S-001', date: new Date(), total: 2000, status: 'draft',
    lines: { create: [{ description: 'شراء مادة', qty: 2, unitPrice: 1000, accountId: expense.id }] }
  }});
  const inv3 = await prisma.invoice.create({ data: {
    projectId: p1.id, type: 'contractor', number: 'INV-K-001', date: new Date(), total: 3000, status: 'draft',
    lines: { create: [{ description: 'أعمال مقاول', qty: 1, unitPrice: 3000, accountId: expense.id }] }
  }});

  // Contractors & contracts
  const con1 = await prisma.contractor.create({ data: { name: 'شركة المقاولات أ' } });
  await prisma.contractorContract.createMany({ data: [
    { contractorId: con1.id, projectId: p1.id, contractNumber: 'CT-001', date: new Date(), value: 15000 },
    { contractorId: con1.id, projectId: p1.id, contractNumber: 'CT-002', date: new Date(), value: 8000 },
  ]});

  // Minimal journal entries for partner contributions demo
  await prisma.journalEntry.create({ data: {
    date: new Date(), createdBy: 'seed', description: 'مساهمة شريك 1', projectId: p1.id,
    lines: {
      create: [
        { accountId: w1.id, debit: 1000, credit: 0, projectId: p1.id, partnerId: pa.id },
        { accountId: expense.id, debit: 0, credit: 1000, projectId: p1.id },
      ]
    }
  }});
  await prisma.journalEntry.create({ data: {
    date: new Date(), createdBy: 'seed', description: 'مساهمة شريك 2', projectId: p1.id,
    lines: {
      create: [
        { accountId: w2.id, debit: 3000, credit: 0, projectId: p1.id, partnerId: pb.id },
        { accountId: expense.id, debit: 0, credit: 3000, projectId: p1.id },
      ]
    }
  }});

  // A posted example
  await prisma.invoice.update({ where: { id: inv1.id }, data: { status: 'posted' } });
  await prisma.invoice.update({ where: { id: inv2.id }, data: { status: 'posted' } });
  await prisma.invoice.update({ where: { id: inv3.id }, data: { status: 'posted' } });
}

main().then(async () => {
  await prisma.$disconnect();
}).catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});

