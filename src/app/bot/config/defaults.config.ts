import { hydrate } from '@grammyjs/hydrate';
import dedent from 'dedent';
import { GrammyError, HttpError, session } from 'grammy';
import { sessionOptions } from '~/app/bot/config/session.config';
import { fileMiddleware } from '~/app/bot/core/middlewares/file.middleware';
import { scenariosMiddleware } from '~/app/bot/core/middlewares/scenarios.middleware';
import { userMiddleware } from '~/app/bot/core/middlewares/user.middleware';
import { workflowsMiddleware } from '~/app/bot/core/middlewares/workflows.middleware';
import { TypedBot } from '~/app/bot/types/bot';
import { failReactions } from '~/utils/dicts/reactions.dict';
import { failResults } from '~/utils/dicts/results.dict';
import { choice } from '~/utils/misc/choice';
import { noop } from '~/utils/misc/noop';
import { uuid } from '~/utils/misc/uuid';

/** Регистрирует дефолтный обработчик ошибок для бота */
export function registerDefaultErrorHandler(bot: TypedBot): void {
  bot.catch((error) => {
    const ctx = error.ctx;
    const cause = error.error;

    const errid = uuid();

    console.error(
      `❌ Ошибка при обработке запроса (update=${ctx.update.update_id}, errid=${errid})`.concat(
        ctx.from ? ` от ${ctx.from.username} (id=${ctx.from.id}):` : ':'
      )
    );

    if (cause instanceof GrammyError) {
      console.error('🤡 Ошибка в запросе:', cause.description);
    } else if (cause instanceof HttpError) {
      console.error('🗿 Ошибка взаимодействия с Telegram API:', cause);
    } else {
      console.error('🤔 Неизвестная ошибка:', cause);
    }

    // Если в режиме ответа на callback, то ошибку ещё и в answerCallbackQuery отправляем
    if (ctx.callbackQuery) {
      // Но на всякий случай чтоб мы тут нигде не упали, ни в синхронную ошибку, ни в асинхронную, оборачиваем в промис и глушим ошибки
      Promise.try(() => ctx.answerCallbackQuery(choice(failReactions))).catch(noop);
    }

    // В чат посылаем сообщение, что у нас возникла ошибка
    Promise.try(() =>
      ctx.reply(
        dedent`
        ❌ ${choice(failResults)}

        <i>errid=${errid}</i>
      `,
        {
          parse_mode: 'HTML'
        }
      )
    ).catch(noop);
  });
}

/** Регистрирует дефолтные миддлвари для бота */
export function registerDefaultMiddlewares(bot: TypedBot): void {
  // Общие миддлвари
  bot.use(session(sessionOptions));
  bot.use(hydrate());

  // Мои миддлвари
  bot.use(workflowsMiddleware());
  bot.use(scenariosMiddleware());
  bot.use(fileMiddleware());
  bot.use(userMiddleware());
}
