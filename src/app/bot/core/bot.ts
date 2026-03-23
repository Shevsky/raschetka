import { Bot } from 'grammy';
import { fetch, Socks5ProxyAgent } from 'undici';
import { registerAvailableCommands } from '~/app/bot/config/available-commands.config';
import { registerDefaultErrorHandler, registerDefaultMiddlewares } from '~/app/bot/config/defaults.config';
import { registerChecksScenario } from '~/app/bot/core/scenarios/checks.scenario';
import { registerF2BScenario } from '~/app/bot/core/scenarios/f2b.scenario';
import { registerFriendsScenario } from '~/app/bot/core/scenarios/friends.scenario';
import { registerHelpScenario } from '~/app/bot/core/scenarios/help.scenario';
import { registerInviteScenario } from '~/app/bot/core/scenarios/invite.scenario';
import { registerLogsScenario } from '~/app/bot/core/scenarios/logs.scenario';
import { registerMeScenario } from '~/app/bot/core/scenarios/me.scenario';
import { registerStartScenario } from '~/app/bot/core/scenarios/start.scenario';
import { registerUsersScenario } from '~/app/bot/core/scenarios/users.scenario';
import { TypedBot } from '~/app/bot/types/bot';
import { toNativeSignal } from '~/utils/misc/to-native-signal';

export const bot: TypedBot = new Bot(
  process.env.TELEGRAM_BOT_TOKEN,
  process.env.SOCKS_PROXY_URL
    ? {
        client: {
          fetch: ([input, init]: Parameters<typeof fetch>) => {
            return fetch(input, {
              ...(init ?? {}),
              signal: init?.signal ? toNativeSignal(init.signal) : undefined
            });
          },
          baseFetchConfig: { agent: new Socks5ProxyAgent(process.env.SOCKS_PROXY_URL) }
        }
      }
    : undefined
);

export async function prepareBot(): Promise<void> {
  // 1️⃣ Регистрируем дефолтные параметры для бота
  registerDefaultErrorHandler(bot);
  registerDefaultMiddlewares(bot);

  // 2️⃣ Регистрируем команды и сценарии
  registerChecksScenario(bot);
  registerF2BScenario(bot);
  registerFriendsScenario(bot);
  registerHelpScenario(bot);
  registerInviteScenario(bot);
  registerMeScenario(bot);
  registerStartScenario(bot);
  registerUsersScenario(bot);
  registerLogsScenario(bot);

  // 3️⃣ Регистрируем список доступных команд
  await registerAvailableCommands(bot);
}
