import { prisma } from '@/server/db/prisma';
import { JournalService } from '@/server/services/journal/JournalService';

type ReceiptInput = {
  date: Date;
  amount: number;
  cashboxAccountId: string;
  projectId?: string;
  description?: string;
  createdBy: string;
  clientAccountId?: string;
  revenueAccountId?: string;
  partnerWalletAccountId?: string;
  dimensions?: { cashboxId?: string; clientId?: string; partnerId?: string };
};

type PaymentInput = {
  date: Date;
  amount: number;
  cashboxAccountId: string;
  projectId?: string;
  description?: string;
  createdBy: string;
  expenseAccountId?: string;
  supplierAccountId?: string;
  partnerWalletAccountId?: string;
  dimensions?: { cashboxId?: string; supplierId?: string; partnerId?: string };
};

type TransferInput = {
  date: Date;
  amount: number;
  fromCashboxAccountId: string;
  toCashboxAccountId: string;
  projectId?: string;
  description?: string;
  createdBy: string;
  dimensions?: { cashboxIdFrom?: string; cashboxIdTo?: string };
};

export class VoucherService {
  static async receipt(input: ReceiptInput) {
    return JournalService.createBalancedEntry({
      date: input.date,
      description: input.description || 'سند قبض',
      projectId: input.projectId,
      createdBy: input.createdBy,
      lines: [
        { accountId: input.cashboxAccountId, debit: input.amount, cashboxId: input.dimensions?.cashboxId, projectId: input.projectId },
        input.clientAccountId ? { accountId: input.clientAccountId, credit: input.amount, clientId: input.dimensions?.clientId, projectId: input.projectId } :
        input.revenueAccountId ? { accountId: input.revenueAccountId, credit: input.amount, projectId: input.projectId } :
        { accountId: input.partnerWalletAccountId!, credit: input.amount, partnerId: input.dimensions?.partnerId, projectId: input.projectId },
      ],
    });
  }

  static async payment(input: PaymentInput) {
    return JournalService.createBalancedEntry({
      date: input.date,
      description: input.description || 'سند صرف',
      projectId: input.projectId,
      createdBy: input.createdBy,
      lines: [
        input.expenseAccountId ? { accountId: input.expenseAccountId, debit: input.amount, projectId: input.projectId } :
        input.supplierAccountId ? { accountId: input.supplierAccountId, debit: input.amount, projectId: input.projectId } :
        { accountId: input.partnerWalletAccountId!, debit: input.amount, partnerId: input.dimensions?.partnerId, projectId: input.projectId },
        { accountId: input.cashboxAccountId, credit: input.amount, cashboxId: input.dimensions?.cashboxId, projectId: input.projectId },
      ],
    });
  }

  static async transfer(input: TransferInput) {
    return JournalService.createBalancedEntry({
      date: input.date,
      description: input.description || 'تحويل بين الخزن',
      projectId: input.projectId,
      createdBy: input.createdBy,
      lines: [
        { accountId: input.toCashboxAccountId, debit: input.amount, cashboxId: input.dimensions?.cashboxIdTo, projectId: input.projectId },
        { accountId: input.fromCashboxAccountId, credit: input.amount, cashboxId: input.dimensions?.cashboxIdFrom, projectId: input.projectId },
      ],
    });
  }
}

