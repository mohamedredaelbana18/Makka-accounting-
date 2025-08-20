import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '@/server/db/prisma';

export type JournalDimension = {
  projectId?: string;
  cashboxId?: string;
  clientId?: string;
  supplierId?: string;
  partnerId?: string;
  invoiceId?: string;
  phaseId?: string;
  materialId?: string;
};

export type JournalLineInput = JournalDimension & {
  accountId: string;
  debit?: number | string;
  credit?: number | string;
};

export class JournalService {
  static async createBalancedEntry(params: {
    date: Date;
    ref?: string;
    description?: string;
    projectId?: string;
    createdBy: string;
    lines: JournalLineInput[];
  }) {
    const totalDebit = params.lines.reduce((sum, l) => sum + Number(l.debit || 0), 0);
    const totalCredit = params.lines.reduce((sum, l) => sum + Number(l.credit || 0), 0);
    if (Math.abs(totalDebit - totalCredit) > 0.0001) {
      throw new Error('Journal not balanced');
    }

    return prisma.$transaction(async (tx) => {
      const entry = await tx.journalEntry.create({
        data: {
          date: params.date,
          ref: params.ref,
          description: params.description,
          projectId: params.projectId,
          createdBy: params.createdBy,
        },
      });

      await tx.journalLine.createMany({
        data: params.lines.map((l) => ({
          entryId: entry.id,
          accountId: l.accountId,
          debit: new Decimal(l.debit || 0),
          credit: new Decimal(l.credit || 0),
          projectId: l.projectId ?? params.projectId,
          cashboxId: l.cashboxId,
          clientId: l.clientId,
          supplierId: l.supplierId,
          partnerId: l.partnerId,
          invoiceId: l.invoiceId,
          phaseId: l.phaseId,
          materialId: l.materialId,
        })),
      });

      return entry;
    });
  }
}

