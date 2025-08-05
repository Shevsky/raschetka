import { backToMeQuery, seeAssignedChecksQuery, seeCreatedChecksQuery } from '~/app/bot/config/queries.config';
import { meScenario } from '~/app/bot/config/scenarios.config';
import { getMeAssignedChecksMessage, getMeCreatedChecksMessage, getMeDefaultMessage } from '~/app/bot/core/messages/me.messages';
import { TypedBot } from '~/app/bot/types/bot';
import { checkService } from '~/app/services/check.service';
import { CheckStatus } from '~/persistence';

/**
 * 👯‍♀️ Сценарий для просмотра информации о себе внутри бота
 * 1. Возвращает список всех чеков, которые ты создал;
 * 2. Возвращает список всех чеков, в которых ты есть как участник;
 * 3. Возвращает список друзей (тех, кого пригласил в бот)
 */
export function registerMeScenario(bot: TypedBot) {
  // ⬇️ Главный обработчик сценария: реагирует на команду /me
  bot.command('me', async (ctx, next) => {
    const user = await ctx.user();

    const [countCreated, countAssigned] = await checkService.countChecksByUserId(user.id);
    await ctx.replyDuringScenario(meScenario, ...getMeDefaultMessage(user, countCreated, countAssigned));

    return next();
  });

  // ⬇️ Обработчик возврата через кнопку назад
  bot.callbackQuery(backToMeQuery.regex, async (ctx, next) => {
    const user = await ctx.user();

    const [countCreated, countAssigned] = await checkService.countChecksByUserId(user.id);
    await ctx.editDuringScenario(meScenario, ...getMeDefaultMessage(user, countCreated, countAssigned));

    return next();
  });

  // ⬇️ Обработчик на кнопку просмотра созданных чеков
  bot.callbackQuery(seeCreatedChecksQuery.regex, async (ctx) => {
    const user = await ctx.user();

    await ctx.answerCallbackQuery();

    const createdChecks = await checkService.getChecksByUserId(user.id, [CheckStatus.ACTIVE, CheckStatus.COMPLETED]);
    await ctx.editDuringScenario(meScenario, ...getMeCreatedChecksMessage(createdChecks));
  });

  // ⬇️ Обработчик на кнопку просмотра назначенных чеков
  bot.callbackQuery(seeAssignedChecksQuery.regex, async (ctx) => {
    const user = await ctx.user();

    await ctx.answerCallbackQuery();

    const assignedChecks = await checkService.getChecksByParticipantUserId(user.id, [CheckStatus.ACTIVE, CheckStatus.COMPLETED]);
    await ctx.editDuringScenario(meScenario, ...getMeAssignedChecksMessage(assignedChecks));
  });
}
