import { NextResponse } from 'next/server';
import { BackupService } from '@/server/services/backup/BackupService';

export async function POST() {
  const res = await BackupService.runNow(true);
  return NextResponse.json(res);
}

