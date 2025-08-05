import { match } from 'ts-pattern';
import { CheckItemModel } from '~/persistence';

type Target = CheckItemModel;

export enum ItemsSorter {
  INDEX = 'index',
  NAME = 'name'
}

export const itemsSortVariants: Record<ItemsSorter, string> = {
  [ItemsSorter.INDEX]: 'По номеру в чеке',
  [ItemsSorter.NAME]: 'По имени'
};

export function getItemsComparer(sorter: ItemsSorter, order: Order): (a: Target, b: Target) => number {
  return (a, b) =>
    order *
    match(sorter)
      .with(ItemsSorter.INDEX, () => a.index - b.index)
      .with(ItemsSorter.NAME, () => a.name.localeCompare(b.name))
      .otherwise(() => 0);
}
