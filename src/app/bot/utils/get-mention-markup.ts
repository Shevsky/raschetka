import { findTelegramAccount } from '~/app/bot/utils/find-telegram-account';
import { UserModel } from '~/persistence';
import { formatUserEmoji } from '~/utils/formatters/format-user';

type MentionMarkupOptions = {
  format: boolean;
};

export function getMentionMarkup(user: UserModel, { format }: MentionMarkupOptions): string {
  const telegramAccount = findTelegramAccount(user);

  return `<a href="tg://user?id=${telegramAccount?.providerId}">${[format && formatUserEmoji(user), user.name].filter(Boolean).join(' ')}</a>`;
}
