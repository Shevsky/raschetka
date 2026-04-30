import crypto from 'node:crypto';
import { match } from 'ts-pattern';
import { getCheckAssignedMessage } from '~/app/bot/core/messages/checks.messages';
import { getInviteFromUserAcceptedMessage } from '~/app/bot/core/messages/users.messages';
import { getWelcomeButRegisteredMessage, getWelcomeMessage } from '~/app/bot/core/messages/welcome.messages';
import { TypedBot } from '~/app/bot/types/bot';
import { TypedMessage } from '~/app/bot/types/message';
import { getStoragePathPair, StorageTarget } from '~/app/config/storage.config';
import { Prisma } from '~/app/prisma';
import { checkService } from '~/app/services/check.service';
import { userService } from '~/app/services/user.service';
import { detectGender } from '~/app/usecases/detect-gender.usecase';
import { ExternalAccountProvider } from '~/persistence';

enum StartCommandMatchAction {
  CHECK = 'check',
  INVITE = 'invite'
}

/**
 * 🤖 Простой сценарий с обработчиком команды /start
 * 1. Регистрирует пользователя, если его нет в базе;
 * 2. Обрабатывает аргументы команды
 */
export function registerStartScenario(bot: TypedBot): void {
  bot.command('start', async (ctx, next) => {
    const from = ctx.from!;
    const [user, wasRegistered] = await ctx
      .user(true)
      .then((registeredUser) => [registeredUser, true] as const)
      .catch(async (error) => {
        // https://www.prisma.io/docs/orm/reference/error-reference#p2025
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
          // Пользователя не нашли, значит создадим его сейчас

          let userpic: Nullish<string> = null;
          const photos = await ctx.api.getUserProfilePhotos(from.id, { limit: 1 });

          if (photos.total_count) {
            const photo = photos.photos.at(0)?.at(-1);

            if (photo) {
              const filename = crypto
                .createHash('sha1')
                .update(`${from.username}\0${photo.file_unique_id}`)
                .digest('hex')
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                .slice(0, 18);
              const pair = getStoragePathPair(StorageTarget.USERPICS, filename, 'jpg');

              await ctx.streamFile(photo, pair.fullpath);
              userpic = pair.path;
            }
          }

          const createdUser = await userService.createExternalProvidedUser(
            ExternalAccountProvider.TELEGRAM,
            String(from.id),
            from.username,
            from.first_name,
            null,
            from.last_name,
            detectGender(from.first_name),
            from.username ? `@${from.username}` : null,
            userpic
          );

          console.info(`🐣 Зарегистрировался новый пользователь: ${createdUser.name} (id=${createdUser.id})`);

          return [createdUser, false] as const;
        } else {
          // Если это какая-то другая ошибка, то выкидываем её наружу

          throw error;
        }
      });

    // Дефолтный ответ на ввод этой команды
    let message: TypedMessage = wasRegistered ? getWelcomeButRegisteredMessage() : getWelcomeMessage();

    if (ctx.match) {
      // Если команда была указана с аргументами, то парсим их
      const [action, ...args] = ctx.match.split('_');

      message = await match(action)
        // 🤖 Команда /start check_{checkId} для открытия бота сразу же с кнопкой вызова чека
        .with(StartCommandMatchAction.CHECK, async () => {
          const [checkId] = args;

          const check = await checkService.getCheck(checkId);

          return getCheckAssignedMessage(check);
        })
        // 🤖 Команда /start invite_{inviterId} для принятия приглашения на регистрацию в боте
        .with(StartCommandMatchAction.INVITE, async () => {
          const [inviterId] = args;

          if (await userService.acceptInviteFromUser(user.id, inviterId)) {
            // Делаем пользователей друзьями

            const inviter = await userService.getUser(inviterId);

            return getInviteFromUserAcceptedMessage(inviter);
          } else {
            // Если не получилось, то значит уже друзья, посылаем дефолтное сообщение

            return message;
          }
        })
        .otherwise(() => message);
    }

    await ctx.reply(...message);

    return next();
  });
}
