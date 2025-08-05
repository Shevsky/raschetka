import { getLatestUsersMessage } from '~/app/bot/core/messages/users.messages';
import { TypedBot } from '~/app/bot/types/bot';
import { userService } from '~/app/services/user.service';
import { Permission } from '~/persistence';

/** 🤖 Простой сценарий с обработчиком команды /users */
export function registerUsersScenario(bot: TypedBot) {
  bot.command('users', async (ctx, next) => {
    // Получаем текущего пользователя
    const user = await ctx.user();

    if (!user.permissions.includes(Permission.SEE_USERS)) {
      // Если нет прав на управление пользователями, то дальше не идём
      return next();
    }

    const latestUsersTake = 20;
    const latestUsers = await userService.getLatestUsers(latestUsersTake);

    await ctx.reply(...getLatestUsersMessage(latestUsers));

    return next();
  });
}
