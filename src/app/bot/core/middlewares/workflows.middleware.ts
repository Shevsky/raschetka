import { Context, MiddlewareFn } from 'grammy';
import { createSessionAccessor } from '~/app/bot/utils/create-session-accessor';

export type WorkflowsMiddlewareFlavor<C extends Context = Context> = C & {
  isWorkflowActive: (id: string) => boolean;
  matchWorkflow: (id: string) => Array<string>;
  enterWorkflow: (id: string, ...args: Array<string>) => void;
  exitWorkflow: (id: string) => void;
};

type WorkflowsMiddlewareSession = Array<string>;

/**
 * Добавляет функционал типа conversation, но без всего оверхерда, связанного с ними.
 * По сути просто позволяет диалогу войти в какой-то режим воркфлоу, в любой момент проверить находимся ли мы в этом режиме,
 * и запомнить аргументы с которыми в этот режим вошли.
 * Всё! Больше ничего того, что есть у conversation. Я хуй знает, там очень много всего лишнего и куча ограничений,
 * вплоть до того, что нужно сериализовать ошибки от вызовов api, пиздец!
 */
export function workflowsMiddleware() {
  // Ключ сессии, где хранится информация о фазах
  const key = (id: string) => `$workflow:${id}`;

  return ((ctx, next) => {
    const patched = ctx as WorkflowsMiddlewareFlavor;

    patched.isWorkflowActive = (id) => {
      const session = createSessionAccessor<WorkflowsMiddlewareSession>(key(id), ctx);

      return !!session.value?.length;
    };

    patched.matchWorkflow = (id) => {
      const session = createSessionAccessor<WorkflowsMiddlewareSession>(key(id), ctx);

      return session.value ?? [];
    };

    patched.enterWorkflow = (id, ...args) => {
      const session = createSessionAccessor<WorkflowsMiddlewareSession>(key(id), ctx);

      session.value = args;
    };

    patched.exitWorkflow = (id) => {
      const session = createSessionAccessor<WorkflowsMiddlewareSession>(key(id), ctx);

      session.value = null;
    };

    return next();
  }) satisfies MiddlewareFn;
}
