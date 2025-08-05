import { getLogsInvalidUsageMessage, getLogsMessage } from '~/app/bot/core/messages/logs.messages';
import { TypedBot } from '~/app/bot/types/bot';
import { readLogs } from '~/app/usecases/read-logs.usecase';
import { Permission } from '~/persistence';

/** 🤖 Простой сценарий с обработчиком команды /logs */
export function registerLogsScenario(bot: TypedBot) {
  bot.command('logs', async (ctx, next) => {
    // Получаем текущего пользователя
    const user = await ctx.user();

    if (!user.permissions.includes(Permission.SEE_LOGS)) {
      // Если нет прав на чтение логов, то дальше не идём
      return next();
    }

    const lines = Number(ctx.match);

    if (!lines) {
      await ctx.reply(...getLogsInvalidUsageMessage());

      return next();
    }

    const logs = await readLogs(lines);

    await ctx.reply(...getLogsMessage(logs));

    return next();
  });
}
