import { Bot } from 'grammy';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { registerAvailableCommands } from '~/app/bot/config/available-commands.config';
import { registerDefaultErrorHandler, registerDefaultMiddlewares } from '~/app/bot/config/defaults.config';
import { registerChecksScenario } from '~/app/bot/core/scenarios/checks.scenario';
import { registerF2BScenario } from '~/app/bot/core/scenarios/f2b.scenario';
import { registerFriendsScenario } from '~/app/bot/core/scenarios/friends.scenario';
import { registerHelpScenario } from '~/app/bot/core/scenarios/help.scenario';
import { registerInviteScenario } from '~/app/bot/core/scenarios/invite.scenario';
import { registerLobbyScenario } from '~/app/bot/core/scenarios/lobby.scenario';
import { registerLogsScenario } from '~/app/bot/core/scenarios/logs.scenario';
import { registerMeScenario } from '~/app/bot/core/scenarios/me.scenario';
import { registerStartScenario } from '~/app/bot/core/scenarios/start.scenario';
import { registerUsersScenario } from '~/app/bot/core/scenarios/users.scenario';
import { TypedBot } from '~/app/bot/types/bot';

export const bot: TypedBot = new Bot(
  process.env.TELEGRAM_BOT_TOKEN,
  process.env.SOCKS_PROXY_URL
    ? {
        client: { baseFetchConfig: { agent: new SocksProxyAgent(process.env.SOCKS_PROXY_URL), compress: true } }
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
  registerLobbyScenario(bot);
  registerStartScenario(bot);
  registerUsersScenario(bot);
  registerLogsScenario(bot);

  // 3️⃣ Регистрируем список доступных команд
  await registerAvailableCommands(bot);
}
