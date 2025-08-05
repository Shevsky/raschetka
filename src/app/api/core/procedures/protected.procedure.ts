import { TRPCError } from '@trpc/server';
import { t } from '~/app/api/config/trpc.config';

export const protectedProcedure = t.procedure.use(
  t.middleware(({ ctx, next }) => {
    if (!ctx.req.isAuthenticated()) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return next({ ctx: { user: ctx.req.user! } });
  })
);
