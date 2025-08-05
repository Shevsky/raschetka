import { startOfDay, subDays } from 'date-fns';
import nodeCron from 'node-cron';
import { checkService } from '~/app/services/check.service';

/** 🔄 Запускает джобу на архивацию чеков (из COMPLETED в ARCHIVED) */
export function startArchiveChecksJob() {
  // Ищем только чеки которые уже более N дней в COMPLETED
  const days = 7;

  return nodeCron.schedule('0 11 * * *', async () => {
    const cutoff = startOfDay(subDays(new Date(), days));
    const checks = await checkService.getChecksCompletedBefore(cutoff);

    if (checks.length) {
      const ids = checks.map((check) => check.id);

      await checkService.archiveChecks(ids);
      console.info(`🚮 Заархивировали чеки (нашли ${checks.length}: ${ids.join(', ')})`);
    }
  });
}
