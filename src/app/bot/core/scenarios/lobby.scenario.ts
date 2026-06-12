import { InputFile } from 'grammy';
import { newLobbyQuery } from '~/app/bot/config/queries.config';
import { deepLinkUrl } from '~/app/bot/config/urls.config';
import { getLobbyAlreadyExistsMessage, getLobbyCreatedCaption, getLobbyCreatedMessage } from '~/app/bot/core/messages/lobby.messages';
import { TypedBot, TypedContext } from '~/app/bot/types/bot';
import { lobbyService } from '~/app/services/lobby.service';
import { generateQRImage } from '~/app/usecases/generate-qr-image.usecase';
import { LobbyModel, Permission } from '~/persistence';

/** 👯‍♀️ Сценарий по работе с расчётами для сбора людей */
export function registerLobbyScenario(bot: TypedBot) {
  // ⬇️ Главный обработчик сценария: реагирует на команду /lobby
  bot.command('lobby', async (ctx, next) => {
    // Запоминаем юзера, он нам понадобится дальше
    const user = await ctx.user();

    if (!user.permissions.includes(Permission.CREATE_CHECKS)) {
      console.info(`🙅‍♀️ ${user.name} (id=${user.id}) попытался создать чек, но мы это проигнорировали`);

      // Если нет прав на создание чеков, то дальше не идём
      return next();
    }

    let lobby = await lobbyService.getOpenedLobbyByUserId(user.id);

    if (lobby) {
      return ctx.reply(...getLobbyAlreadyExistsMessage(lobby));
    }

    lobby = await lobbyService.createLobby(user.id, []);

    await replyAfterLobbyCreated(ctx, lobby);
  });

  // ⬇️ Обработчик на кнопку создать новый (удалить старый) расчёт
  bot.callbackQuery(newLobbyQuery.regex, async (ctx, next) => {
    // Запоминаем юзера, он нам понадобится дальше
    const user = await ctx.user();

    if (!user.permissions.includes(Permission.CREATE_CHECKS)) {
      console.info(`🙅‍♀️ ${user.name} (id=${user.id}) попытался создать чек, но мы это проигнорировали`);

      // Если нет прав на создание чеков, то дальше не идём
      return next();
    }

    const lobby = await lobbyService.createLobby(user.id, [], true);

    await replyAfterLobbyCreated(ctx, lobby);
    await ctx.answerCallbackQuery();
  });

  async function replyAfterLobbyCreated(ctx: TypedContext, lobby: LobbyModel): Promise<void> {
    const qr = await generateQRImage(deepLinkUrl(`lobby_${lobby.id}`));

    if (qr) {
      await ctx.replyWithPhoto(new InputFile(qr, `${lobby.id}.png`), {
        caption: getLobbyCreatedCaption(lobby),
        show_caption_above_media: true,
        parse_mode: 'HTML'
      });
    } else {
      console.error('🤔 Не удалось создать QR код');

      await ctx.reply(getLobbyCreatedCaption(lobby), {
        parse_mode: 'HTML'
      });
    }

    await ctx.reply(...getLobbyCreatedMessage());
  }
}
