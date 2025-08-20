import { NextRequest, NextResponse } from 'next/server';
import { SettlementService } from '@/server/services/settlement/SettlementService';

export async function POST(req: NextRequest) {
  const { projectId, date, note, createdBy } = await req.json();
  const res = await SettlementService.executeSettlement(projectId, { date: new Date(date), note, createdBy });
  return NextResponse.json(res);
}

