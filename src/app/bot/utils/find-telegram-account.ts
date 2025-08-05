import { ExternalAccountModel, ExternalAccountProvider, UserModel } from '~/persistence';

export function findTelegramAccount(user: UserModel): Nullish<ExternalAccountModel> {
  return user.accounts?.find((externalAccount) => externalAccount.provider === ExternalAccountProvider.TELEGRAM);
}
