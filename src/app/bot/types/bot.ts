import type { HydrateFlavor } from '@grammyjs/hydrate';
import type { Bot, Context, SessionFlavor } from 'grammy';
import type { Session } from '~/app/bot/config/session.config';
import type { FileMiddlewareFlavor } from '~/app/bot/core/middlewares/file.middleware';
import type { ScenariosMiddlewareFlavor } from '~/app/bot/core/middlewares/scenarios.middleware';
import type { UserMiddlewareFlavor } from '~/app/bot/core/middlewares/user.middleware';
import type { WorkflowsMiddlewareFlavor } from '~/app/bot/core/middlewares/workflows.middleware';

export type TypedContext = WorkflowsMiddlewareFlavor<
  ScenariosMiddlewareFlavor<HydrateFlavor<UserMiddlewareFlavor<FileMiddlewareFlavor<Context>>> & SessionFlavor<Session>>
>;

export type TypedBot = Bot<TypedContext>;
