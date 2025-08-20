import { prisma } from '@/server/db/prisma';
import { JournalService } from '@/server/services/journal/JournalService';

export class InvoiceService {
  static async postCustomerInvoice(invoiceId: string, params: { customersAccountId: string; createdBy: string; }) {
    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId }, include: { lines: true } });
    if (!invoice) throw new Error('Invoice not found');
    if (invoice.type !== 'customer') throw new Error('Not a customer invoice');
    const total = Number(invoice.total);
    const revenueLines = invoice.lines.map((l) => ({ accountId: l.accountId, credit: Number(l.qty) * Number(l.unitPrice), projectId: invoice.projectId }));
    await JournalService.createBalancedEntry({
      date: invoice.date,
      description: `ترحيل فاتورة عميل ${invoice.number}`,
      projectId: invoice.projectId,
      createdBy: params.createdBy,
      lines: [
        { accountId: params.customersAccountId, debit: total, projectId: invoice.projectId, invoiceId: invoice.id },
        ...revenueLines,
      ],
    });
    await prisma.invoice.update({ where: { id: invoiceId }, data: { status: 'posted' } });
  }

  static async postSupplierInvoice(invoiceId: string, params: { suppliersAccountId: string; createdBy: string; }) {
    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId }, include: { lines: true } });
    if (!invoice) throw new Error('Invoice not found');
    if (invoice.type !== 'supplier') throw new Error('Not a supplier invoice');
    const total = Number(invoice.total);
    const expenseLines = invoice.lines.map((l) => ({ accountId: l.accountId, debit: Number(l.qty) * Number(l.unitPrice), projectId: invoice.projectId }));
    await JournalService.createBalancedEntry({
      date: invoice.date,
      description: `ترحيل فاتورة مورد ${invoice.number}`,
      projectId: invoice.projectId,
      createdBy: params.createdBy,
      lines: [
        ...expenseLines,
        { accountId: params.suppliersAccountId, credit: total, projectId: invoice.projectId, invoiceId: invoice.id },
      ],
    });
    await prisma.invoice.update({ where: { id: invoiceId }, data: { status: 'posted' } });
  }

  static async postContractorInvoice(invoiceId: string, params: { contractorsAccountId: string; createdBy: string; }) {
    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId }, include: { lines: true } });
    if (!invoice) throw new Error('Invoice not found');
    if (invoice.type !== 'contractor') throw new Error('Not a contractor invoice');
    const total = Number(invoice.total);
    const expenseLines = invoice.lines.map((l) => ({ accountId: l.accountId, debit: Number(l.qty) * Number(l.unitPrice), projectId: invoice.projectId }));
    await JournalService.createBalancedEntry({
      date: invoice.date,
      description: `ترحيل فاتورة مقاول ${invoice.number}`,
      projectId: invoice.projectId,
      createdBy: params.createdBy,
      lines: [
        ...expenseLines,
        { accountId: params.contractorsAccountId, credit: total, projectId: invoice.projectId, invoiceId: invoice.id },
      ],
    });
    await prisma.invoice.update({ where: { id: invoiceId }, data: { status: 'posted' } });
  }
}

