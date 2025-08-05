import { getInviteUserMessage } from '~/app/bot/core/messages/users.messages';
import { TypedBot } from '~/app/bot/types/bot';

/** 🤖 Простой сценарий с единственным обработчиком команды /invite */
export function registerInviteScenario(bot: TypedBot): void {
  bot.command('invite', async (ctx, next) => {
    const user = await ctx.user();

    await ctx.reply(...getInviteUserMessage(user));

    return next();
  });
}
