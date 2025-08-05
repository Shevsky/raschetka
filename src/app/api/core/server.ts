import fastifyStatic from '@fastify/static';
import { fastifyTRPCPlugin, FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';
import fastify, { FastifyRequest } from 'fastify';
import { IncomingMessage } from 'node:http';
import { resolve } from 'node:path';
import { registerDefaultErrorHandler, registerDefaultPlugins } from '~/app/api/config/defaults.config';
import { createContext } from '~/app/api/config/trpc.config';
import { ApiRouter, apiRouter } from '~/app/api/core/routers/api.router';

export const server = fastify({
  maxParamLength: 5000,
  logger: { level: process.env.DEBUG === '1' ? 'debug' : 'error' },
  disableRequestLogging: true
});

// 1️⃣ Регистрируем дефолтные настройки для сервера
registerDefaultErrorHandler(server);
registerDefaultPlugins(server);

// 2️⃣ Подключаем хак для доступа к сессиям из вебсокета https://jonathan-frere.com/posts/trpc-fastify-websockets/
const requests = new WeakMap<FastifyRequest | IncomingMessage, FastifyRequest>();
server.addHook('onRequest', async (req) => {
  requests.set(req.raw, req);
});

// Регистрирует обработчик для всех запросов, чтобы делегировать их trpc
server.register(fastifyTRPCPlugin, {
  prefix: '/api',
  useWSS: true,
  trpcOptions: {
    router: apiRouter,
    createContext(options) {
      const realReq = requests.get(options.req.raw ?? options.req) ?? options.req;

      return createContext({ ...options, req: realReq });
    },
    onError({ path, error }) {
      console.error(`👻 Ошибка tRPC на '${path}':`, error);
    }
  } satisfies FastifyTRPCPluginOptions<ApiRouter>['trpcOptions']
});

// Подключаем плагин для статики
server.register(fastifyStatic, {
  prefix: '/storage',
  root: resolve(process.env.STORAGE_PATH),
  list: false
});
