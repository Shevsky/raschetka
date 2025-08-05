import { getUserFriendsMessage } from '~/app/bot/core/messages/users.messages';
import { TypedBot } from '~/app/bot/types/bot';
import { userService } from '~/app/services/user.service';

/** 🤖 Простой сценарий с единственным обработчиком команды /friends */
export function registerFriendsScenario(bot: TypedBot): void {
  bot.command('friends', async (ctx, next) => {
    const user = await ctx.user();
    const friends = await userService.getUserFriends(user.id);

    await ctx.reply(...getUserFriendsMessage(friends));

    return next();
  });
}
