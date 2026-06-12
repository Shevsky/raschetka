import { z } from 'zod';
import { t } from '~/app/api/config/trpc.config';
import { protectedProcedure } from '~/app/api/core/procedures/protected.procedure';
import { lobbyService } from '~/app/services/lobby.service';

export const lobbyRouter = t.router({
  /** Получить данные по комнате */
  getLobby: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      return lobbyService.getLobbyIfAvailable(input.id, ctx.user.id);
    })
});
