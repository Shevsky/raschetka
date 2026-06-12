import fastifyPlugin from 'fastify-plugin';
import { lobbyController } from '~/app/api/core/controllers/lobby.controller';

export const httpController = fastifyPlugin(
  async (instance) => {
    instance.register(lobbyController);
  },
  { encapsulate: true }
);
