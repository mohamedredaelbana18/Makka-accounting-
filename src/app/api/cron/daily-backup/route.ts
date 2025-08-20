import { NextResponse } from 'next/server';
import { BackupService } from '@/server/services/backup/BackupService';

export async function GET() {
  const res = await BackupService.runDailyIfNeeded();
  return NextResponse.json({ status: res.status, runAt: res.runAt });
}

