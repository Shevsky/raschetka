/** Создаёт прокси, который при любом чтении свойства возвращает его же имя */
export function identityProxy<T>(mapper: (key: string) => T): Record<string, T>;
export function identityProxy(): Record<string, string>;
export function identityProxy(mapper?: (key: string) => unknown): Record<string, unknown> {
  return new Proxy(
    {},
    {
      get(target, property) {
        if (!Object.hasOwn(target, property)) {
          const value = String(property);

          target[property] = mapper ? mapper(value) : value;
        }

        return target[property];
      }
    }
  );
}
