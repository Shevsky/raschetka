import { CheckItemModel } from '~/persistence';
import { regexFromString } from '~/utils/misc/regex-from-string';

type Target = CheckItemModel;

export function getItemsFilterer(query: string): (value: Target) => boolean {
  if (query) {
    const regex = regexFromString(query);

    return (item) => {
      return regex.test(item.name);
    };
  } else {
    return () => true;
  }
}
