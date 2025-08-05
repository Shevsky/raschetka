import { hash } from '~/utils/misc/hash';

describe('hash', () => {
  test('Возвращает неотрицательное целое число', () => {
    const h = hash('test');

    expect(Number.isInteger(h)).toBe(true);
    expect(h).toBeGreaterThanOrEqual(0);
  });

  test('Один и тот же хеш для одного и того же значения', () => {
    const a = hash('hello');
    const b = hash('hello');

    expect(a).toBe(b);
  });

  test('Разные строки дают разные хеши (вероятно...)', () => {
    expect(hash('foo')).not.toBe(hash('bar'));
    expect(hash('Foo')).not.toBe(hash('foo'));
  });
});
