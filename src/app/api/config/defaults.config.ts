import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import fastifyWebSocket from '@fastify/websocket';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { IncomingMessage } from 'node:http';
import { authenticator } from '~/app/api/config/authenticator.config';
import { InvalidArgumentError } from '~/utils/errors/invalid-argument.error';

// Хак для доступа к сессиям из вебсокета или других обработчиков https://jonathan-frere.com/posts/trpc-fastify-websockets/
export const requests = new WeakMap<FastifyRequest | IncomingMessage, FastifyRequest>();

/** Регистрирует хак для доступа к сессиям */
export function registerDefaultRequestsStorage(server: FastifyInstance): void {
  server.addHook('onRequest', async (req) => {
    requests.set(req.raw, req);
  });
}

/** Регистрирует дефолтный обработчик ошибок */
export function registerDefaultErrorHandler(server: FastifyInstance): void {
  server.setErrorHandler((error, req, reply) => {
    const realReq = requests.get(req.raw ?? req) ?? req;
    const user = realReq?.user;

    const { status, message } =
      error instanceof InvalidArgumentError ? { status: 400, message: 'Bad request' } : { status: 500, message: 'Internal error' };

    console.error(`☄️ Ошибка ${status} глобального обработчика на '${req.url}' от пользователя ${user?.name} (id=${user?.id}):`, error);

    reply.status(status).send({
      error: {
        code: status,
        message: process.env.NODE_ENV === 'production' ? message : error.message
      }
    });
  });
}

/** Регистрирует дефолтные плагины */
export function registerDefaultPlugins(server: FastifyInstance): void {
  // Подключаем вебсокеты
  server.register(fastifyWebSocket);

  // Подключаем куки и сессии
  server.register(fastifyCookie);
  server.register(fastifySession, {
    secret: process.env.APP_SESSION_SECRET,
    cookie: { secure: false, httpOnly: true, sameSite: 'lax', path: '/' },
    rolling: false,
    saveUninitialized: false
  });

  // Подключаем плагин паспорта для аутентификации
  server.register(authenticator.initialize());
  server.register(authenticator.secureSession());
}
