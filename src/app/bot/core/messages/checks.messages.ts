import dedent from 'dedent';
import { InlineKeyboard } from 'grammy';
import { cancelCheckGroupQuery, cancelCheckQuery, doneCheckGroupQuery, startCheckGroupQuery } from '~/app/bot/config/queries.config';
import { deepLinkUrl, webCheckUrl } from '~/app/bot/config/urls.config';
import { TypedMessage } from '~/app/bot/types/message';
import { getMentionMarkup } from '~/app/bot/utils/get-mention-markup';
import { CheckGroupModel, CheckModel, CheckParticipantModel, UserModel } from '~/persistence';
import { calculateParticipantSums } from '~/utils/business/calculate-participant-sums';
import { drinksEmojis, preparedFoodsEmojis } from '~/utils/dicts/emojis.dict';
import {
  formatCheckComment,
  formatCheckFull,
  formatCheckTitle,
  formatCheckTotalSum,
  formatCheckTransactionAt
} from '~/utils/formatters/format-check';
import { formatMoney } from '~/utils/formatters/format-money';
import { formatPlural } from '~/utils/formatters/format-plural';
import { choice } from '~/utils/misc/choice';
import { sumBy } from '~/utils/misc/sum-by';

export function getCheckCreatedMessage(check: CheckModel) {
  return [
    dedent`
      <b>✅ Чек создан</b>

      🧾 ${formatCheckTitle(check)}
      📅 ${formatCheckTransactionAt(check)}
      💵 ${formatCheckTotalSum(check)} ${check.tipsSum > 0 ? ` (включая чаевые ☕️ ${formatMoney(check.tipsSum)})` : ''}

      🔗 Ссылка на чек ⬇️ Перейди по ней и выбери свои товары

      <b>${deepLinkUrl(`check_${check.id}`)}</b>
    `,
    {
      parse_mode: 'HTML',
      reply_markup: InlineKeyboard.from([[InlineKeyboard.webApp(`🧾 ${formatCheckFull(check)}`, webCheckUrl(check.id))]])
    }
  ] satisfies TypedMessage;
}

export function getCheckAssignedMessage(check: CheckModel) {
  return [
    dedent`
      ${getMentionMarkup(check.user!, { format: true })} отправил вам чек

      🧾 ${formatCheckTitle(check)}
      📅 ${formatCheckTransactionAt(check)}
      💵 ${formatCheckTotalSum(check)} ${check.tipsSum > 0 ? ` (включая чаевые 🫰 ${formatMoney(check.tipsSum)})` : ''}

      Нажмите на кнопку ⬇️ чтобы перейти к нему
    `,
    {
      parse_mode: 'HTML',
      reply_markup: InlineKeyboard.from([[InlineKeyboard.webApp(`🧾 ${formatCheckFull(check)}`, webCheckUrl(check.id))]])
    }
  ] satisfies TypedMessage;
}

export function getCheckFilledMessage(check: CheckModel, recipient: UserModel, participant: CheckParticipantModel) {
  const { itemGroupsSums, itemsSum, tipsSum, totalSum } = calculateParticipantSums(check, participant);

  const rows = [
    ...Array.from(itemGroupsSums.entries()).map(
      ([itemGroup, sum]) => `${choice(drinksEmojis)} ${itemGroup.name}: <b>${formatMoney(sum)}</b>`
    ),
    `${choice(preparedFoodsEmojis)} Товаров на сумму: <b>${formatMoney(itemsSum)}</b>`,
    tipsSum > 0 && `☕️ Чаевые: <b>${formatMoney(tipsSum)}</b>`,
    `\n🫰🏻🫰🏻🫰🏻 Итого: <b>${formatMoney(totalSum)}</b>`
  ].filter(Boolean);

  if (recipient.id === check.userId) {
    // Получаем оставшихся участников, которые не заполнили свой чек
    const restParticipants = check.participants!.filter((iterableParticipant) => !iterableParticipant.filled);
    // И список товаров, которые никто на себя не назначил
    const restUnassignedItems = check.items!.filter((item) => !item.groupId && !item.participantId);

    let information: Array<string>;

    if (restUnassignedItems.length) {
      // Если остались ещё какие-то товары

      if (restParticipants.length > 0) {
        if (restParticipants.length === 1 && restParticipants[0].userId === recipient.id) {
          information = [
            'Все заполнили свои чеки. Остался только ты 🫵',
            `Можешь зайти в управление чеком и забрать ${formatPlural(restUnassignedItems.length, 'оставшийся {} товар', 'оставшиеся {} товара', 'оставшиеся {} товаров')} на себя`
          ];
        } else {
          information = [
            `${formatPlural(restUnassignedItems.length, 'Остался {} товар', 'Осталось {} товара', 'Осталось {} товаров')} и ещё ${restParticipants.length} кто не заполнил свой чек ${restParticipants.length === 1 ? ` (это ${getMentionMarkup(restParticipants[0].user!, { format: true })})` : ''}`
          ];
        }
      } else {
        information = [
          `Все заполнили свои чеки, но ${formatPlural(restUnassignedItems.length, 'остался ещё {} товар', 'осталось ещё {} товара', 'осталось ещё {} товаров')} 🤷`,
          'Можешь зайти в управление чеком и посмотреть кто и что мог забыть 🤔'
        ];
      }
    } else {
      // Если товаров не осталось

      information = ['Все товары в чеке были распределены по людям 🤝'];
    }

    rows.push(`\n<i>${information.join('\n')}</i>`);
  } else {
    rows.push(
      `Столько ⬆️ нужно будет перевести ${getMentionMarkup(check.user!, { format: true })}`,
      check.comment && `\n❗ ${formatCheckComment(check)}`
    );
  }

  return [
    dedent`
      <b>✅ ${recipient.id === participant.userId ? 'Супер! Ты заполнил и выбрал свои товары' : `${getMentionMarkup(participant.user!, { format: true })} заполнил и выбрал свои товары`} в чеке ${formatCheckTitle(check)}</b>

      ${rows.join('\n')}
    `,
    {
      parse_mode: 'HTML',
      reply_markup:
        recipient.id === check.userId
          ? undefined
          : InlineKeyboard.from([[InlineKeyboard.webApp(`🧾 ${formatCheckFull(check)}`, webCheckUrl(check.id))]])
    }
  ] satisfies TypedMessage;
}

export function getCheckDraftCreatedMessage(check: CheckModel, isDuplicate: boolean) {
  return [
    dedent`
      <b>☑️ Распарсил чек</b> ${isDuplicate ? '(но ты уже отправлял его ранее)' : ''}

      Осталось его настроить...

      🧾 ${formatCheckTitle(check)}
      📅 ${formatCheckTransactionAt(check)}
      💵 ${formatCheckTotalSum(check)}
    `,
    {
      parse_mode: 'HTML',
      reply_markup: InlineKeyboard.from([
        [InlineKeyboard.webApp('⚙️ Настроить чек', webCheckUrl(check.id))],
        [InlineKeyboard.text('🖇️ Объединить с другим', startCheckGroupQuery.with(check.id))],
        [InlineKeyboard.text('❌ Отмена', cancelCheckQuery.with(check.id))]
      ])
    }
  ] satisfies TypedMessage;
}

export function getCheckNextDraftCreatedWhenGroupMessage(check: CheckModel, group: CheckGroupModel) {
  return [
    dedent`
      <b>☑️ Распарсил ещё один чек</b> (сейчас их ${group.checks!.length + 1} в группе)

      🧾 ${formatCheckTitle(check)}
      📅 ${formatCheckTransactionAt(check)}
      💵 ${formatCheckTotalSum(check)}

      💰 Сумма всех чеков ${formatMoney(sumBy([check, ...group.checks!], 'totalSum'))}

      <i>Если нужно добавить ещё один чек в группу, то присылай его</i>
    `,
    {
      parse_mode: 'HTML',
      reply_markup: InlineKeyboard.from([
        [InlineKeyboard.text('✔️ Закончить', doneCheckGroupQuery.with(group.id))],
        [InlineKeyboard.text('❌ Отмена', cancelCheckGroupQuery.with(group.id))]
      ])
    }
  ] satisfies TypedMessage;
}

export function getCheckDuplicateReceivedWhenGroupMessage(group: CheckGroupModel) {
  return [
    dedent`
      🙅‍♂️ Это тот же самый чек, который уже был добавлен в группу (сейчас в группе ${group.checks!.length})

      <i>Пришли новый чек, либо отмени группировку ⬇️</i>
    `,
    {
      parse_mode: 'HTML',
      reply_markup: InlineKeyboard.from(
        [
          group.checks!.length > 1 && [InlineKeyboard.text('✔️ Закончить', doneCheckGroupQuery.with(group.id))],
          [InlineKeyboard.text('❌ Отмена', cancelCheckGroupQuery.with(group.id))]
        ].filter(Boolean)
      )
    }
  ] satisfies TypedMessage;
}

export function getCheckDraftCreatedFromGroupMessage(check: CheckModel) {
  return [
    dedent`
      <b>☑️ Распарсил ${formatPlural(check.parentChecksCount, '{} чек', '{} чека', '{} чеков')} и объединил их в один ☝️</b>

      Осталось это всё настроить...

      🧾 ${formatCheckTitle(check)}
      📅 ${formatCheckTransactionAt(check)}
      💰 На общую сумму ${formatMoney(check.totalSum)}
    `,
    {
      parse_mode: 'HTML',
      reply_markup: InlineKeyboard.from([
        [InlineKeyboard.webApp('⚙️ Настроить чек', webCheckUrl(check.id))],
        [InlineKeyboard.text('❌ Отмена', cancelCheckQuery.with(check.id))]
      ])
    }
  ] satisfies TypedMessage;
}

export function getCheckGroupCreatedMessage(group: CheckGroupModel) {
  return [
    '👀 Окей, присылай следующий чек (фотку или json)',
    {
      reply_markup: InlineKeyboard.from([[InlineKeyboard.text('❌ Отмена', cancelCheckGroupQuery.with(group.id))]])
    }
  ] satisfies TypedMessage;
}
