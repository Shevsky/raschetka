import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { t } from '~/app/api/config/trpc.config';
import { publicProcedure } from '~/app/api/core/procedures/public.procedure';
import { userService } from '~/app/services/user.service';
import { parseTelegramInitData } from '~/app/usecases/parse-telegram-init-data.usecase';
import { ExternalAccountProvider } from '~/persistence';
import { Left } from '~/utils/misc/either';

export const telegramRouter = t.router({
  /** Вход для telegram web app */
  auth: publicProcedure
    .input(
      z.object({
        initDataRaw: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const out = parseTelegramInitData(
        input.initDataRaw,
        process.env.TELEGRAM_BOT_TOKEN,
        Number(process.env.TELEGRAM_BOT_AUTH_DATE_TTL) || Infinity
      );

      if (out instanceof Left) {
        throw new TRPCError({ code: 'BAD_REQUEST', cause: out.error });
      }

      const user = await userService.getUserByExternalAccount(ExternalAccountProvider.TELEGRAM, String(out.value.user.id));

      await ctx.req.login(user);

      return user;
    })
});
