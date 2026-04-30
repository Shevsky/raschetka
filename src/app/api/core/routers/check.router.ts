import { TRPCError } from '@trpc/server';
import { filter, switchMap } from 'rxjs/operators';
import { z } from 'zod';
import { t } from '~/app/api/config/trpc.config';
import { checkUpdatedEvent } from '~/app/api/core/events/check-updated.event';
import { protectedProcedure } from '~/app/api/core/procedures/protected.procedure';
import { checkService } from '~/app/services/check.service';
import { CheckStatus, Permission } from '~/persistence';
import { toAsyncIterator } from '~/utils/misc/to-async-iterator';

export const checkRouter = t.router({
  /** Получить список созданных чеков у пользователя */
  getCreatedChecks: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        archived: z.boolean().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      // Если запрашивают инфу не по себе, то проверяем права
      if (input.userId !== ctx.user.id && !ctx.user.permissions.includes(Permission.SEE_CHECKS)) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      return checkService.getChecksByUserId(
        input.userId,
        input.archived ? [CheckStatus.ARCHIVE] : [CheckStatus.ACTIVE, CheckStatus.COMPLETED]
      );
    }),
  /** Получить список назначенных чеков на пользователя */
  getAssignedChecks: protectedProcedure
    .input(
      z.object({
        userId: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      // Если запрашивают инфу не по себе, то проверяем права
      if (input.userId !== ctx.user.id && !ctx.user.permissions.includes(Permission.SEE_CHECKS)) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      return checkService.getChecksByParticipantUserId(input.userId, [CheckStatus.ACTIVE, CheckStatus.COMPLETED]);
    }),
  /** Получить данные по чеку */
  getCheck: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      // Если нет прав на чтение всех чеков, то дополнительно проверим что у пользователя есть доступ к этому самому чеку
      const canSeeChecks = ctx.user.permissions.includes(Permission.SEE_CHECKS);

      return canSeeChecks ? checkService.getCheck(input.id) : checkService.getCheckIfAvailable(input.id, ctx.user.id);
    }),
  /** Публикация чека (перевод из драфта в активный) */
  fillCheck: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        comment: z.string(),
        tipsSum: z.number(),
        userIdsAsParticipants: z.array(z.string()).min(1),
        itemGroups: z.array(
          z.object({
            name: z.string(),
            itemIds: z.array(z.string()).min(1),
            userIds: z.array(z.string())
          })
        )
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.permissions.includes(Permission.CREATE_CHECKS)) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      await checkService.fillCheck(
        input.id,
        ctx.user.id,
        input.title,
        input.comment,
        input.tipsSum,
        input.userIdsAsParticipants,
        input.itemGroups
      );
    }),
  /** Заполнение чека (выбор своих товаров и... всё) */
  pickCheckItems: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        itemIds: z.array(z.string())
      })
    )
    .mutation(async ({ ctx, input }) => {
      await checkService.pickCheckItems(input.id, ctx.user.id, input.itemIds);

      checkUpdatedEvent.next({ id: input.id, updatedByUserId: ctx.user.id });
    }),
  /** Закрыть чек */
  completeCheck: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      await checkService.completeCheckIfAuthor(input.id, ctx.user.id);

      checkUpdatedEvent.next({ id: input.id, updatedByUserId: ctx.user.id });
    }),
  /** Подписка на событие если чек кто-то изменил/заполнил */
  onCheckUpdated: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .subscription(({ ctx, input }) => {
      const userId = ctx.user.id;
      const canSeeChecks = ctx.user.permissions.includes(Permission.SEE_CHECKS);

      return toAsyncIterator(
        checkUpdatedEvent.pipe(
          filter((payload) => payload.id === input.id && payload.updatedByUserId !== userId),
          switchMap(() => (canSeeChecks ? checkService.getCheck(input.id) : checkService.getCheckIfAvailable(input.id, userId)))
        )
      );
    })
});
