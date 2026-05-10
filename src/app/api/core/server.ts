import fastifyStatic from '@fastify/static';
import { fastifyTRPCPlugin, FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import { resolve } from 'node:path';
import {
  registerDefaultErrorHandler,
  registerDefaultPlugins,
  registerDefaultRequestsStorage,
  requests
} from '~/app/api/config/defaults.config';
import { createContext } from '~/app/api/config/trpc.config';
import { ApiRouter, apiRouter } from '~/app/api/core/routers/api.router';

export const server = fastify({
  maxParamLength: 5000,
  logger: { level: process.env.DEBUG === '1' ? 'debug' : 'error' },
  disableRequestLogging: true,
  trustProxy: true
});

// 1️⃣ Регистрируем дефолтные настройки для сервера
registerDefaultErrorHandler(server);
registerDefaultPlugins(server);
registerDefaultRequestsStorage(server);

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
    onError({ path, error, req }) {
      const realReq = requests.get(req.raw ?? req) ?? req;
      const user = realReq?.user;

      console.error(`👻 Ошибка tRPC на '${path}' от пользователя ${user?.name} (id=${user?.id}, ip=${req.ip}):`, error);
    }
  } satisfies FastifyTRPCPluginOptions<ApiRouter>['trpcOptions']
});

// Подключаем плагин для статики
server.register(fastifyStatic, {
  prefix: '/storage',
  root: resolve(process.env.STORAGE_PATH),
  list: false,
  dotfiles: 'deny'
});

server.register(fastifyStatic, {
  prefix: '/assets',
  root: resolve(process.env.PUBLIC_PATH, 'assets'),
  list: false,
  dotfiles: 'deny',
  decorateReply: false
});

server.get('*', (_, reply) => {
  reply.sendFile('index.html', process.env.PUBLIC_PATH);
});

// Обработчик 404 только после плагина статики
server.setNotFoundHandler((req, reply) => {
  const realReq = requests.get(req.raw ?? req) ?? req;
  const user = realReq?.user;

  console.error(`🦞 Ошибка 404 на '${req.url}' от пользователя ${user?.name} (id=${user?.id}, ip=${req.ip}): Not found`);

  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  reply.status(404).send({
    error: { code: 404, message: 'Not found' }
  });
});
