import { CheckItemModel } from '~/persistence';

export function normalizeCheckItems<const T extends Partial<CheckItemModel>>(items: Array<T>): Array<T> {
  return [...traverseCheckItems(items)];
}

function* traverseCheckItems<const T extends Partial<CheckItemModel>>(items: Array<T>): Iterable<T> {
  for (const item of items) {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    if (item.quantity && item.quantity % 1 === 0 && item.quantity > 1 && item.quantity <= 40) {
      // todo для нецелых наверное тоже надо сделать, ну типа когда пиво 0.5 идёт как 6 внутри одной позиции

      // Если количество товара целое, больше 1 и меньше 40, то надо разбить это на отдельные товары
      // Число 40 выбрано просто так с бухты-барахты 🤷
      for (let i = 0; i < item.quantity; i++) {
        yield {
          ...item,
          quantity: 1
        };
      }
    } else {
      yield item;
    }
  }
}
