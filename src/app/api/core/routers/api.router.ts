import { t } from '~/app/api/config/trpc.config';
import { checkRouter } from '~/app/api/core/routers/check.router';
import { telegramRouter } from '~/app/api/core/routers/telegram.router';
import { userRouter } from '~/app/api/core/routers/user.router';

export const apiRouter = t.router({
  telegram: telegramRouter,
  user: userRouter,
  check: checkRouter
});

export type ApiRouter = typeof apiRouter;
