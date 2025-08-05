import { getWelcomeMessage } from '~/app/bot/core/messages/welcome.messages';
import { TypedBot } from '~/app/bot/types/bot';

/** 🤖 Простой сценарий с единственным обработчиком команды /help */
export function registerHelpScenario(bot: TypedBot) {
  bot.command('help', async (ctx, next) => {
    await ctx.reply(...getWelcomeMessage());

    return next();
  });
}
