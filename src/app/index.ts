import startApi from '~/app/api';
import startBot from '~/app/bot';
import { configureStorage } from '~/app/config/storage.config';
import startScheduler from '~/app/scheduler';
import { configureSuperjson } from '~/config/superjson.config';
import '~/polyfills';

async function main(): Promise<void> {
  configureSuperjson();
  await configureStorage();

  await Promise.all([
    startBot(), // Запускаем бота
    startApi() // Запускаем сервер для api
  ]);

  // Запускаем шедулер
  startScheduler();
}

await main();
