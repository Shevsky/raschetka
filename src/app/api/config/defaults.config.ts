import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import fastifyWebSocket from '@fastify/websocket';
import { FastifyInstance } from 'fastify';
import { authenticator } from '~/app/api/config/authenticator.config';
import { InvalidArgumentError } from '~/utils/errors/invalid-argument.error';

/** Регистрирует дефолтный обработчик ошибок */
export function registerDefaultErrorHandler(server: FastifyInstance): void {
  server.setErrorHandler((error, req, reply) => {
    const { status, message } =
      error instanceof InvalidArgumentError ? { status: 400, message: 'Bad request' } : { status: 500, message: 'Internal error' };

    req.log.error(error);

    reply.status(status).send({
      error: {
        code: error.code,
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
