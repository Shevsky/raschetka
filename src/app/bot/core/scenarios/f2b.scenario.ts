import {
  getF2BBannedMessage,
  getF2BInvalidIPMessage,
  getF2BInvalidUsageMessage,
  getF2BListMessage,
  getF2BUnbannedMessage
} from '~/app/bot/core/messages/f2b.messages';
import { TypedBot } from '~/app/bot/types/bot';
import { f2bBan, f2bList, f2bUnban } from '~/app/usecases/f2b.usecase';
import { Permission } from '~/persistence';
import { isIPV4 } from '~/utils/misc/is-ipv4';

/**
 * 🤖 Сценарии для работы с fail2ban:
 * - /f2b list
 * - /f2b ban <ip>
 * - /f2b unban <ip>
 */
export function registerF2BScenario(bot: TypedBot) {
  bot.command('f2b', async (ctx, next) => {
    // Получаем текущего пользователя
    const user = await ctx.user();

    if (!user.permissions.includes(Permission.FAIL2BAN)) {
      // Если нет прав на работу с fail2ban, то дальше не идём
      return next();
    }

    const [command, ...args] = ctx.match.split(' ');

    switch (command) {
      case 'list': {
        const ips = await f2bList();

        await ctx.reply(...getF2BListMessage(ips));

        return next();
      }
      case 'ban':
      case 'unban': {
        const ip = args[0];

        if (!isIPV4(ip)) {
          await ctx.reply(...getF2BInvalidIPMessage());

          return next();
        }

        await (command === 'ban' ? f2bBan(ip) : f2bUnban(ip));
        await (command === 'ban' ? ctx.reply(...getF2BBannedMessage(ip)) : ctx.reply(...getF2BUnbannedMessage(ip)));

        return next();
      }
      default: {
        await ctx.reply(...getF2BInvalidUsageMessage());

        return next();
      }
    }
  });
}
