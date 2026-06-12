import dedent from 'dedent';
import { InlineKeyboard } from 'grammy';
import { newLobbyQuery } from '~/app/bot/config/queries.config';
import { deepLinkUrl, webLobbyUrl } from '~/app/bot/config/urls.config';
import { TypedMessage } from '~/app/bot/types/message';
import { getMentionMarkup } from '~/app/bot/utils/get-mention-markup';
import { LobbyModel } from '~/persistence';
import { formatLocaleDate } from '~/utils/formatters/format-locale-date';

export function getLobbyJoinedMessage(lobby: LobbyModel) {
  return [
    dedent`
      <b>✅ Ты присоединился</b> к комнате ${getMentionMarkup(lobby.user!, { format: true })}

      Как только появится чек, я сообщу тебе об этом 🤙
    `,
    {
      parse_mode: 'HTML'
    }
  ] satisfies TypedMessage;
}

export function getLobbyAlreadyClosedMessage(lobby: LobbyModel) {
  return [
    dedent`
      🙅‍♀️ Эта комната уже закрыта. Вероятно, уже есть более новая...

      За подробностями обратись к ${getMentionMarkup(lobby.user!, { format: true })}
    `,
    {
      parse_mode: 'HTML'
    }
  ] satisfies TypedMessage;
}

export function getLobbyAlreadyExistsMessage(lobby: LobbyModel) {
  return [
    dedent`
      🤔 У тебя уже есть комната от <b>${formatLocaleDate(lobby.createdAt)}</b>

      Делаем с ней что-то, или создаём новую?
    `,
    {
      parse_mode: 'HTML',
      reply_markup: InlineKeyboard.from([
        [InlineKeyboard.webApp('👀 Посмотреть что там', webLobbyUrl(lobby.id))],
        [InlineKeyboard.text('🆕 Создать новую (удалить старую)', newLobbyQuery.with(lobby.id))],
        [InlineKeyboard.text('❌ Отмена (ничего не делать)', '-')]
      ])
    }
  ] satisfies TypedMessage;
}

export function getLobbyCreatedCaption(lobby: LobbyModel) {
  return dedent`
      🔗 Ссылка на комнату ⬇️ Перейди по ней, чтобы присоединиться

      <b>${deepLinkUrl(`lobby_${lobby.id}`)}</b>
    `;
}

export function getLobbyCreatedMessage() {
  return [
    dedent`
      ⬆️ А теперь ждём пока все присоединятся к комнате

      Как только у тебя будет чек, просто присылай сюда его фотку (QR код) или json
    `,
    {
      disable_notification: true
    }
  ] satisfies TypedMessage;
}
