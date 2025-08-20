import { prisma } from '@/server/db/prisma';
import { JournalService } from '@/server/services/journal/JournalService';

type Contribution = {
  partnerId: string;
  paid: number;
  received: number;
  net: number;
  walletAccountId: string;
};

export class SettlementService {
  static async computeContributions(projectId: string): Promise<Contribution[]> {
    const partners = await prisma.projectPartner.findMany({ where: { projectId }, include: { partner: true } });
    const partnerIdToWallet: Record<string, string> = Object.fromEntries(partners.map((p) => [p.partnerId, p.walletAccountId]));

    const lines = await prisma.journalLine.groupBy({
      by: ['partnerId', 'accountId'],
      where: { projectId, partnerId: { not: null } },
      _sum: { debit: true, credit: true }
    });

    const map: Record<string, Contribution> = {};
    for (const p of partners) {
      map[p.partnerId] = { partnerId: p.partnerId, paid: 0, received: Number(p.previousCarry), net: Number(p.previousCarry), walletAccountId: p.walletAccountId };
    }

    for (const l of lines) {
      if (!l.partnerId) continue;
      const delta = Number(l._sum.debit || 0) - Number(l._sum.credit || 0);
      // Positive delta means partner wallet debited => paid for project
      const c = map[l.partnerId];
      c.paid += Math.max(delta, 0);
      c.received += Math.max(-delta, 0);
      c.net = c.paid - c.received;
    }

    return Object.values(map);
  }

  static computeMatching(contributions: Contribution[]) {
    const receivers = contributions
      .map((c) => ({ ...c, due: c.net }))
      .filter((c) => c.due > 0)
      .sort((a, b) => b.due - a.due);
    const payers = contributions
      .map((c) => ({ ...c, due: -c.net }))
      .filter((c) => c.due > 0)
      .sort((a, b) => b.due - a.due);

    const transfers: { fromPartnerId: string; toPartnerId: string; amount: number }[] = [];
    let i = 0, j = 0;
    while (i < payers.length && j < receivers.length) {
      const pay = payers[i];
      const recv = receivers[j];
      const amount = Math.min(pay.due, recv.due);
      transfers.push({ fromPartnerId: pay.partnerId, toPartnerId: recv.partnerId, amount });
      pay.due -= amount;
      recv.due -= amount;
      if (pay.due <= 1e-6) i++;
      if (recv.due <= 1e-6) j++;
    }
    return transfers;
  }

  static async executeSettlement(projectId: string, params: { date: Date; note?: string; createdBy: string; }) {
    const contributions = await this.computeContributions(projectId);
    const average = contributions.reduce((s, c) => s + c.net, 0) / Math.max(contributions.length, 1);
    const dues = contributions.map((c) => ({ ...c, net: c.net - average }));
    const transfers = this.computeMatching(dues);

    if (transfers.length === 0) {
      return { settlementId: null, transfers: [], average };
    }

    return prisma.$transaction(async (tx) => {
      const settlement = await tx.settlement.create({ data: { projectId, date: params.date, note: params.note } });
      await tx.settlementLine.createMany({ data: transfers.map((t) => ({ settlementId: settlement.id, ...t, amount: t.amount })) });

      await JournalService.createBalancedEntry({
        date: params.date,
        description: `تسوية شركاء للمشروع ${projectId}`,
        projectId,
        createdBy: params.createdBy,
        lines: transfers.flatMap((t) => [
          { accountId: dues.find((d) => d.partnerId === t.toPartnerId)!.walletAccountId, debit: t.amount, partnerId: t.toPartnerId, projectId },
          { accountId: dues.find((d) => d.partnerId === t.fromPartnerId)!.walletAccountId, credit: t.amount, partnerId: t.fromPartnerId, projectId },
        ]),
      });

      // Set previousCarry to the new baseline (average) and reset current by journal entry above
      for (const d of contributions) {
        await tx.projectPartner.updateMany({
          where: { projectId, partnerId: d.partnerId },
          data: { previousCarry: average },
        });
      }

      return { settlementId: settlement.id, transfers, average };
    });
  }
}

