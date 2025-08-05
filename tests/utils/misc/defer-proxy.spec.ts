import { deferProxy } from '~/utils/misc/defer-proxy';

describe('deferProxy', () => {
  test('Отбрасывает ошибку если ещё не готов', () => {
    let value: { x: number } | null = null;
    const proxy = deferProxy(() => value);

    expect(() => proxy.x).toThrowError();
  });

  test('Прокси готов к использованию', () => {
    let value: { x: number } | null = null;

    const proxy = deferProxy(() => value);

    value = { x: 42 };

    expect(proxy.x).toBe(42);
  });
});
