import { startArchiveChecksJob } from '~/app/scheduler/jobs/archive-checks.job';

export default function startScheduler(): void {
  startArchiveChecksJob();

  console.info('✅ Шедулер запущен');
}
