import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { t } from '~/app/api/config/trpc.config';
import { protectedProcedure } from '~/app/api/core/procedures/protected.procedure';
import { userService } from '~/app/services/user.service';
import { Permission } from '~/persistence';

export const userRouter = t.router({
  /** Получить пользователя по его айди */
  getUser: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.id !== ctx.user.id && !ctx.user.permissions.includes(Permission.SEE_USERS)) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      return userService.getUser(input.id, true);
    }),
  /** Получить список друзей пользователя */
  getUserFriends: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.id !== ctx.user.id && !ctx.user.permissions.includes(Permission.SEE_USERS)) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      return userService.getUserFriends(input.id);
    }),
  /** Получить всех зарегистрированных пользователей */
  getLatestUsers: protectedProcedure
    .input(
      z.object({
        take: z.number().optional(),
        skip: z.number().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.user.permissions.includes(Permission.SEE_USERS)) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      return userService.getLatestUsers(input.take, input.skip);
    }),
  /** Выдать или забрать какой-то пермишен */
  toggleUserPermission: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        permission: z.nativeEnum(Permission)
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.permissions.includes(Permission.EDIT_USERS)) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      // Защита от дурака, чтоб у самого себя не отнять права
      if (input.id === ctx.user.id && [Permission.SEE_USERS, Permission.EDIT_USERS].includes(input.permission)) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      return userService.toggleUserPermission(input.id, input.permission);
    })
});
