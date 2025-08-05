import { Context, MiddlewareFn } from 'grammy';
import { createSessionAccessor } from '~/app/bot/utils/create-session-accessor';
import { noop } from '~/utils/misc/noop';

export type ScenariosMiddlewareFlavor<C extends Context = Context> = C & {
  replyDuringScenario: (id: string, ...args: Parameters<C['reply']>) => ReturnType<C['reply']>;
  editDuringScenario: (id: string, ...args: Parameters<C['editMessageText']>) => ReturnType<C['editMessageText']>;
  flushScenario: (id: string) => Promise<void>;
};

type ScenariosMiddlewareSession = {
  latestReply?: ScenariosMiddlewareLatestReply;
};

type ScenariosMiddlewareLatestReply = {
  id: number;
  withMarkup: boolean;
};

/**
 * Добавляем механизм сценариев...
 * Позволяет послать юзеру ответ "в режиме сценария", что означает, что если в таком ответе были какие-то кнопки,
 * то при следующем ответе тоже "в режиме сценария", из последнего ответа будут удалены кнопки.
 * Нужно это для того, чтобы выбрать какой-то ответ из кнопок можно было только один раз.
 * Если отправили какое-то новое сообщение, в котором тоже есть кнопки, то в последнем сообщении их нужно удалить
 */
export function scenariosMiddleware() {
  // Ключ сессии, где хранится информация о сценариях
  const key = (id: string) => `$scenario:${id}`;

  return ((ctx, next) => {
    const patched = ctx as ScenariosMiddlewareFlavor;

    // ⬇️ Добавляет метод для ответа в режиме сценария
    patched.replyDuringScenario = async (id, ...args) => {
      const session = createSessionAccessor<ScenariosMiddlewareSession>(key(id), ctx);

      const latestReply = session.value?.latestReply;

      if (latestReply && latestReply.withMarkup) {
        await Promise.try(() => ctx.api.editMessageReplyMarkup(ctx.chatId!, latestReply.id)).catch(noop);

        session.value = null;
      }

      const reply = await ctx.reply(...args);

      session.value = {
        latestReply: { id: reply.message_id, withMarkup: !!reply.reply_markup }
      };

      return reply;
    };

    // ⬇️ Добавляет метод для редактирования последнего отправленного сообщения в режиме сценария
    patched.editDuringScenario = async (id, ...args) => {
      const session = createSessionAccessor<ScenariosMiddlewareSession>(key(id), ctx);

      const fallback = async () => {
        const reply = await ctx.reply(...args);

        session.value = {
          latestReply: { id: reply.message_id, withMarkup: !!reply.reply_markup }
        };
      };

      const latestReply = session.value?.latestReply;

      if (latestReply) {
        // Если последний реплай был давно, то тут мы упадём в ошибку при попытке его изменить, поэтому по ошибке шлём обычный reply
        await Promise.try(() => ctx.api.editMessageText(ctx.chatId!, latestReply.id, ...args)).catch(() => fallback());
      } else {
        // Если последнего реплая нет было, то обычный reply
        await fallback();
      }

      return true;
    };

    // ⬇️ Добавляет метод для очистки кнопок в последнем ответе в режиме сценария
    patched.flushScenario = async (id) => {
      const accessor = createSessionAccessor<ScenariosMiddlewareSession>(key(id), ctx);

      const latestMessage = accessor.value?.latestReply;

      if (latestMessage && latestMessage.withMarkup) {
        await Promise.try(() => ctx.api.editMessageReplyMarkup(ctx.chatId!, latestMessage.id)).catch(noop);

        accessor.value = null;
      }
    };

    return next();
  }) satisfies MiddlewareFn;
}
