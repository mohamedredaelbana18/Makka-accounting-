import { prisma } from '@/server/db/prisma';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

type Provider = 'local' | 'onedrive' | 'gdrive';

export class BackupService {
  static async runDailyIfNeeded() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existing = await prisma.backup.findFirst({
      where: { runAt: { gte: today } },
      orderBy: { runAt: 'desc' }
    });
    if (existing) return existing;
    return this.runNow(false);
  }

  static async runNow(manual = true) {
    const provider = (process.env.BACKUP_PROVIDER || 'local') as Provider;
    const start = Date.now();
    try {
      const filePath = await this.dumpDatabase();
      const res = await this.upload(provider, filePath);
      const stat = fs.statSync(filePath);
      return await prisma.backup.create({
        data: {
          location: provider,
          pathOrDriveId: res,
          sizeBytes: stat.size,
          status: 'ok',
          message: manual ? 'manual' : 'auto'
        }
      });
    } catch (e: any) {
      return await prisma.backup.create({
        data: {
          location: provider,
          pathOrDriveId: '-',
          status: 'failed',
          message: e?.message || String(e)
        }
      });
    }
  }

  static async dumpDatabase() {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL not set');
    const backupsDir = process.env.BACKUP_LOCAL_PATH || path.resolve(process.cwd(), 'backups');
    if (!fs.existsSync(backupsDir)) fs.mkdirSync(backupsDir, { recursive: true });
    const ts = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);
    const filePath = path.join(backupsDir, `backup-${ts}.sql.gz`);
    const cmd = `pg_dump --no-owner --format=plain --dbname='${url}' | gzip > '${filePath}'`;
    await execAsync(cmd);
    return filePath;
  }

  static async upload(provider: Provider, filePath: string) {
    if (provider === 'local') {
      return filePath;
    }
    if (provider === 'onedrive') {
      // TODO: Implement real upload. Placeholder returns local path for now.
      return filePath;
    }
    if (provider === 'gdrive') {
      // TODO: Implement real upload. Placeholder returns local path for now.
      return filePath;
    }
    return filePath;
  }
}

