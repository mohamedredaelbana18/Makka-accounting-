import { BackupService } from './BackupService';

async function main() {
  const result = await BackupService.runDailyIfNeeded();
  // eslint-disable-next-line no-console
  console.log('Backup result:', result.status, result.pathOrDriveId);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

