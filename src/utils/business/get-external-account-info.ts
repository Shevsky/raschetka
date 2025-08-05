import { ExternalAccountModel, ExternalAccountProvider } from '~/persistence';
import { exhaustiveCheck } from '~/utils/misc/exhaustive-check';

type ExternalAccountInfo = {
  provider: ExternalAccountProvider;
  url: string;
  mention: Nullish<string>;
};

export function getExternalAccountInfo(account: ExternalAccountModel): ExternalAccountInfo {
  switch (account.provider) {
    case ExternalAccountProvider.TELEGRAM: {
      return {
        provider: account.provider,
        url: account.login ? `https://t.me/${account.login}` : `tg://user?id=${account.providerId}`,
        mention: account.login ? `@${account.login}` : null
      };
    }
    case ExternalAccountProvider.VK: {
      return {
        provider: account.provider,
        url: account.login ? `https://vk.com/${account.login}` : `https://vk.com/id${account.providerId}`,
        mention: null
      };
    }
    default: {
      return exhaustiveCheck(account.provider);
    }
  }
}
