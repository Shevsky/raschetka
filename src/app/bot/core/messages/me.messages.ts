import dedent from 'dedent';
import { InlineKeyboard } from 'grammy';
import { backToMeQuery, seeAssignedChecksQuery, seeCreatedChecksQuery } from '~/app/bot/config/queries.config';
import { webCheckUrl, webUserUrl } from '~/app/bot/config/urls.config';
import { TypedMessage } from '~/app/bot/types/message';
import { getMentionMarkup } from '~/app/bot/utils/get-mention-markup';
import { CheckModel, UserModel } from '~/persistence';
import { formatCheckFull } from '~/utils/formatters/format-check';
import { formatLocaleDate } from '~/utils/formatters/format-locale-date';
import { formatPlural } from '~/utils/formatters/format-plural';
import { formatUserEmoji } from '~/utils/formatters/format-user';

export function getMeDefaultMessage(user: UserModel, countCreated: number, countAssigned: number) {
  return [
    dedent`
      ${getMentionMarkup(user, { format: false })}

      📅 Зарегистрировался ${formatLocaleDate(user.createdAt, { year: true })}

      ${[
        countCreated
          ? `🧾 ${formatPlural(countCreated, '{} созданный чек', '{} созданных чека', '{} созданных чеков')}`
          : '🙅‍♂️ Созданных чеков нет',
        countAssigned
          ? `🧾 ${formatPlural(countAssigned, '{} назначенный чек', '{} назначенных чека', '{} назначенных чеков')}`
          : '🙅‍♂️ Назначенных чеков нет'
      ]
        .filter(Boolean)
        .join('\n')}

      <i>Чеки, по которым все расчёты уже произведены, не учитываются, да и вообще по прошествию времени могли быть удалены (но ведь они тебе и не нужны?)</i>
    `,
    {
      parse_mode: 'HTML',
      reply_markup: InlineKeyboard.from(
        [
          [InlineKeyboard.webApp(`${formatUserEmoji(user)} Мой профиль`, webUserUrl(user.id))],
          countCreated > 0 && [InlineKeyboard.text('🧾 К созданным чекам', seeCreatedChecksQuery.empty())],
          countAssigned > 0 && [InlineKeyboard.text('🧾 К назначенным чекам', seeAssignedChecksQuery.empty())]
        ].filter(Boolean)
      )
    }
  ] satisfies TypedMessage;
}

export function getMeCreatedChecksMessage(createdChecks: Array<CheckModel>) {
  return [
    'Ниже ⬇️ все созданные тобой чеки на текущий момент',
    {
      parse_mode: 'HTML',
      reply_markup: InlineKeyboard.from([
        ...createdChecks.map((check) => [InlineKeyboard.webApp(`🧾 ${formatCheckFull(check)}`, webCheckUrl(check.id))]),
        [InlineKeyboard.text('⬅️ Назад', backToMeQuery.empty())]
      ])
    }
  ] satisfies TypedMessage;
}

export function getMeAssignedChecksMessage(assignedChecks: Array<CheckModel>) {
  return [
    'Ниже ⬇️ все назначенные на тебя чеки на текущий момент',
    {
      parse_mode: 'HTML',
      reply_markup: InlineKeyboard.from([
        ...assignedChecks.map((check) => [InlineKeyboard.webApp(`🧾 ${formatCheckFull(check)}`, webCheckUrl(check.id))]),
        [InlineKeyboard.text('⬅️ Назад', backToMeQuery.empty())]
      ])
    }
  ] satisfies TypedMessage;
}
