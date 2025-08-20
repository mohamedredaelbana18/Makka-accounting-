import { NextResponse } from 'next/server';
import { prisma } from '@/server/db/prisma';

export async function GET() {
  // No unbalanced journal entries
  const entries = await prisma.journalEntry.findMany({ include: { lines: true } });
  const unbalanced = entries.filter(e => {
    const debit = e.lines.reduce((s, l) => s + Number(l.debit), 0);
    const credit = e.lines.reduce((s, l) => s + Number(l.credit), 0);
    return Math.abs(debit - credit) > 0.0001;
  });
  return NextResponse.json({ ok: unbalanced.length === 0, unbalanced: unbalanced.length });
}

