import { RuntimeError } from '~/utils/errors/runtime.error';

export function deferProxy<T extends object>(get: () => Nullish<T>): NonNullable<T> {
  const need = (): T => {
    const value = get();

    if (value === null || value === undefined) {
      throw new RuntimeError('Объект ещё не готов');
    }

    return value;
  };

  return new Proxy({} as unknown as T, {
    get(_, prop, receiver) {
      return Reflect.get(need(), prop, receiver);
    }
  });
}
