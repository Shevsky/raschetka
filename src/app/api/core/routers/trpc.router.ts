import { t } from '~/app/api/config/trpc.config';
import { checkRouter } from '~/app/api/core/routers/check.router';
import { lobbyRouter } from '~/app/api/core/routers/lobby.router';
import { telegramRouter } from '~/app/api/core/routers/telegram.router';
import { userRouter } from '~/app/api/core/routers/user.router';

export const trpcRouter = t.router({
  telegram: telegramRouter,
  user: userRouter,
  check: checkRouter,
  lobby: lobbyRouter
});

export type TRPCRouter = typeof trpcRouter;
