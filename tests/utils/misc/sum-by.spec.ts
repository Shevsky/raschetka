import { sumBy } from '~/utils/misc/sum-by';

describe('sumBy', () => {
  describe('sumBy с числами', () => {
    test('Суммирует массив чисел', () => {
      expect(sumBy([0])).toBe(0);
      expect(sumBy([1])).toBe(1);
      expect(sumBy([0, 1, 2, 3])).toBe(6);
      expect(sumBy([1, 2, 3])).toBe(6);
    });
  });

  describe('sumBy с объектами', () => {
    interface Item {
      value?: number | string | null;
      other: string;
    }

    const items: Array<Item> = [
      { value: 10, other: 'a' },
      { value: '5', other: 'b' },
      { value: null, other: 'c' },
      { other: 'd' },
      { value: 2.5, other: 'e' }
    ];

    test('Суммирует численные поля по ключу', () => {
      expect(sumBy(items, 'value')).toBe(17.5);
    });

    test('Для пустого массива возвращает 0', () => {
      expect(sumBy([], 'value')).toBe(0);
    });

    test('Игнорирует нечисла и undefined', () => {
      expect(sumBy([{ value: 'abc' }, { value: undefined }], 'value')).toBe(0);
    });
  });
});
