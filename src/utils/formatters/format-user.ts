import { match } from 'ts-pattern';
import { Gender, UserModel } from '~/persistence';
import { femalePersonEmojis, malePersonEmojis, neutralPersonEmojis } from '~/utils/dicts/emojis.dict';
import { hash } from '~/utils/misc/hash';

export function formatUserEmoji(user: UserModel): string {
  const emojis = match(user.gender)
    .with(Gender.MALE, () => malePersonEmojis)
    .with(Gender.FEMALE, () => femalePersonEmojis)
    .otherwise(() => neutralPersonEmojis);

  return emojis[hash(user.name) % emojis.length];
}
