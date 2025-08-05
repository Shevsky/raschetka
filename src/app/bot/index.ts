import { bot, prepareBot } from '~/app/bot/core/bot';
import { botMQWorker } from '~/app/bot/core/bot.mq-worker';

export default async function startBot(): Promise<void> {
  await prepareBot();

  void bot.start({
    onStart: () => {
      console.info('✅ Бот запущен');

      botMQWorker.start().catch(console.error);
    }
  });
}
