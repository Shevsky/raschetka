import { mostFrequent } from '~/utils/misc/most-frequent';

describe('mostFrequent', () => {
  type Item = {
    name: string;
    emoji: string;
    count: number;
  };

  test('Должен возвращать наиболее частый элемент в массиве строк', () => {
    const letters = ['a', 'b', 'a', 'c', 'a', 'b'];

    expect(mostFrequent(letters)).toBe('a');
  });

  test('Должен правильно работать с массивом чисел', () => {
    const numbers = [1, 2, 2, 3, 1, 2];
    expect(mostFrequent(numbers)).toBe(2);
  });

  test('Должен возвращать undefined для пустого массива примитивов', () => {
    const empty: Array<string> = [];

    expect(mostFrequent(empty)).toBeUndefined();
  });

  test('Должен возвращать наиболее частое значение свойства объекта по ключу', () => {
    const items: Array<Item> = [
      { name: 'Apple', emoji: '🍎', count: 1 },
      { name: 'Pear', emoji: '🍐', count: 2 },
      { name: 'Cherry', emoji: '🍒', count: 3 },
      { name: 'Apple2', emoji: '🍎', count: 4 },
      { name: 'Pear2', emoji: '🍐', count: 5 },
      { name: 'Apple3', emoji: '🍎', count: 6 }
    ];

    expect(mostFrequent(items, 'emoji')).toBe('🍎');
  });

  test('Должен возвращать undefined для пустого массива объектов при указании ключа', () => {
    const emptyItems: Array<Item> = [];

    expect(mostFrequent(emptyItems, 'name')).toBeUndefined();
  });

  test('В случае одинаковой частоты возвращает первое встреченное значение', () => {
    const values = ['x', 'y', 'x', 'y'];

    expect(mostFrequent(values)).toBe('x');
  });

  test('Должен корректно работать с числовым свойством объектов', () => {
    const items: Array<Item> = [
      { name: 'A', emoji: '❓', count: 10 },
      { name: 'B', emoji: '❓', count: 20 },
      { name: 'C', emoji: '❓', count: 10 },
      { name: 'D', emoji: '❓', count: 20 },
      { name: 'E', emoji: '❓', count: 20 }
    ];

    expect(mostFrequent(items, 'count')).toBe(20);
  });
});
