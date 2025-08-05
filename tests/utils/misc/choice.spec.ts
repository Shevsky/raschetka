import { choice } from '~/utils/misc/choice';

describe('choice', () => {
  test('Всегда возвращает один из элементов', () => {
    const input = ['a', 'b', 'c', 'd', 'e'];

    for (let i = 0; i < 20; i++) {
      expect(input).toContain(choice(input));
    }
  });

  test('Ничего не возвращает если входной массив пустой', () => {
    expect(choice([])).toBeNullish();
  });
});
