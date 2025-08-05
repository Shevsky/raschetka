import { identityProxy } from '~/utils/misc/identity-proxy';

describe('identityProxy', () => {
  describe('identityProxy без mapper', () => {
    let proxy: Record<string, string>;

    beforeEach(() => {
      proxy = identityProxy();
    });

    test('Возвращает имя свойства для строковых ключей', () => {
      expect(proxy.foo).toBe('foo');
      expect(proxy['ололо пыщ пыщ']).toBe('ололо пыщ пыщ');
    });

    test('Числовые ключи переводит в строки', () => {
      expect(proxy[1]).toBe('1');
      expect(proxy[Number(123)]).toBe('123');
    });

    test('Символы переводит в строки ', () => {
      const sym = Symbol('test');
      // @ts-expect-error тайпскрипт понимает что мы творим хуйню, но всё же
      expect(proxy[sym]).toBe('Symbol(test)');
    });

    test('Повторные вызовы возвращают то же значение', () => {
      const first = proxy.foobarbaz;
      const second = proxy.foobarbaz;

      expect(first).toBe('foobarbaz');
      expect(second).toBe('foobarbaz');
    });

    test('Корректно работает при деструктуризации', () => {
      const { someKey } = proxy;

      expect(someKey).toBe('someKey');
    });

    test('Обрабатывает встроенные методы объекта (хз зачем, но пускай)', () => {
      expect(proxy.toString).toBe('toString');
      expect(proxy.valueOf).toBe('valueOf');
    });
  });

  describe('identityProxy с mapper', () => {
    test('Применяет mapper к каждому ключу', () => {
      const proxy = identityProxy((key) => `__${key}__`);

      expect(proxy.foo).toBe('__foo__');
      expect(proxy.bar).toBe('__bar__');
    });

    test('Может изменять регистр', () => {
      const proxy = identityProxy((key) => key.toUpperCase());

      expect(proxy.lowercase).toBe('LOWERCASE');
      expect(proxy.AnotherOne).toBe('ANOTHERONE');
    });

    test('Работает с числовыми и символьными ключами через mapper', () => {
      const proxy = identityProxy((key) => `#${key}#`);
      expect(proxy[5]).toBe('#5#');
      const sym = Symbol('X');
      // @ts-expect-error
      expect(proxy[sym]).toBe('#Symbol(X)#');
    });

    test('mapper для ключа вызывается один единственный раз', () => {
      let count = 0;

      const proxy = identityProxy((key) => {
        count++;

        return key;
      });

      expect(proxy.recalc).toBe('recalc');
      expect(proxy.recalc).toBe('recalc');
      expect(count).toBe(1);
    });
  });
});
