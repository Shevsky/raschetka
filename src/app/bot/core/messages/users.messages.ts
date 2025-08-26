import { isToday, isWithinInterval, isYesterday, subDays } from 'date-fns';
import dedent from 'dedent';
import { InlineKeyboard } from 'grammy';
import { match } from 'ts-pattern';
import { deepLinkUrl, webUsersUrl } from '~/app/bot/config/urls.config';
import { TypedMessage } from '~/app/bot/types/message';
import { getMentionMarkup } from '~/app/bot/utils/get-mention-markup';
import { UserModel } from '~/persistence';
import { formatLocaleDate } from '~/utils/formatters/format-locale-date';

export function getInviteUserMessage(user: UserModel) {
  return [
    dedent`
      🔗 Перейди по ссылке ниже ⬇️ чтобы зарегаться в боте для проведения расчётов 🧮 и разбивки чеков 🧾

      <b>${deepLinkUrl(`invite_${user.id}`)}</b>
    `,
    {
      parse_mode: 'HTML'
    }
  ] satisfies TypedMessage;
}

export function getInviteToUserAcceptedMessage(user: UserModel) {
  return [
    dedent`
      🤝 По твоей ссылке зарегистрировался ${getMentionMarkup(user, { format: true })}

      <i>Посмотреть всех своих друзей в боте можешь командой /friends</i>
    `,
    {
      parse_mode: 'HTML'
    }
  ] satisfies TypedMessage;
}

export function getInviteFromUserAcceptedMessage(inviter: UserModel) {
  return [
    dedent`
      🤝 Ты принял приглашение от ${getMentionMarkup(inviter, { format: true })} и зарегистрировался в боте

      Сейчас это ни к чему тебя не обязывают — просто когда кто-то создаст чек и пригласит тебя в него, ты узнаешь об этом от меня 👋

      <i>Отправь мне /help если вообще нихрена не понял, что это всё такое</i>
    `,
    {
      parse_mode: 'HTML'
    }
  ] satisfies TypedMessage;
}

export function getUserFriendsMessage(friends: Array<UserModel>) {
  return [
    dedent`
      <b>👨‍👩‍👧‍👦 Твои друзья в боте</b>

      ${friends.map((friend) => getMentionMarkup(friend, { format: true })).join('\n')}
    `,
    {
      parse_mode: 'HTML'
    }
  ] satisfies TypedMessage;
}

export function getLatestUsersMessage(latestUsers: Array<UserModel>) {
  enum Group {
    TODAY = '📅 Сегодня',
    YESTERDAY = '📅 Вчера',
    LAST_WEEK = '📅 За прошедшую неделю',
    LONG_TIME_AGO = '📅 Давно'
  }

  const groups = Object.entries(
    Object.groupBy(latestUsers, (user) => {
      switch (true) {
        case isToday(user.createdAt): {
          return Group.TODAY;
        }
        case isYesterday(user.createdAt): {
          return Group.YESTERDAY;
        }
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        case isWithinInterval(user.createdAt, { start: subDays(new Date(), 7), end: new Date() }): {
          return Group.LAST_WEEK;
        }
        default: {
          return Group.LONG_TIME_AGO;
        }
      }
    })
  ).map(([group, groupedUsers]) => {
    switch (group) {
      case Group.TODAY:
      case Group.YESTERDAY: {
        return [
          match(group)
            .with(Group.TODAY, () => `${group}, ${formatLocaleDate(new Date())}`)
            .with(Group.YESTERDAY, () => `${group}, ${formatLocaleDate(subDays(new Date(), 1))}`)
            .exhaustive(),
          groupedUsers.map((user) => getMentionMarkup(user, { format: true }))
        ] as const;
      }
      default: {
        return [
          group,
          groupedUsers.map((user) => `${getMentionMarkup(user, { format: true })} (${formatLocaleDate(user.createdAt)})`)
        ] as const;
      }
    }
  });

  return [
    dedent`
      <b>‍👨‍👩‍👧‍👦 Последние зарегистрированные пользователи</b>

      ${
        groups.length > 1
          ? groups.map(([title, formattedUsers]) => `${title}\n\n${formattedUsers.join('\n')}`).join('\n\n')
          : groups.length
            ? groups[0][1].join('\n')
            : '🤷 Нет таких'
      }

      <i>Нажмите на кнопку ⬇️ чтобы открыть список всех зарегистрированных пользователей</i>
    `,
    {
      parse_mode: 'HTML',
      reply_markup: InlineKeyboard.from([[InlineKeyboard.webApp('👨‍👩‍👧‍👦 Все пользователи', webUsersUrl)]])
    }
  ] satisfies TypedMessage;
}
