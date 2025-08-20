import { NextRequest, NextResponse } from 'next/server';
import { SettlementService } from '@/server/services/settlement/SettlementService';

export async function GET(req: NextRequest) {
  const projectId = req.nextUrl.searchParams.get('projectId') as string;
  const contributions = await SettlementService.computeContributions(projectId);
  const average = contributions.reduce((s, c) => s + c.net, 0) / Math.max(contributions.length, 1);
  const dues = contributions.map((c) => ({ ...c, due: c.net - average }));
  const transfers = SettlementService.computeMatching(dues as any);
  return NextResponse.json({ contributions, average, transfers });
}

