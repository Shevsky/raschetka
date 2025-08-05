import { UserModel } from '~/persistence';
import { regexFromString } from '~/utils/misc/regex-from-string';
import { translitToCyrillic } from '~/utils/misc/translit-to-cyrillic';

type Target = UserModel;

export function getUsersFilterer(query: string): (value: Target) => boolean {
  if (query) {
    const regex = regexFromString(query);

    return (user) => {
      const keys = [user.name, translitToCyrillic(user.name)];

      return keys.some((key) => regex.test(key));
    };
  } else {
    return () => true;
  }
}
