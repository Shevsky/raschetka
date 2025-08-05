export function mostFrequent<T>(values: Array<T>): Nullish<T>;
export function mostFrequent<T, K extends keyof T>(values: Array<T>, key: K): Nullish<T[K]>;
export function mostFrequent(values: Array<unknown>, key?: PropertyKey): unknown {
  const counts = values.reduce((map: Map<unknown, number>, item) => {
    const value = key && typeof item === 'object' && item ? item[key] : item;
    const prev = map.get(value) ?? 0;

    map.set(value, prev + 1);

    return map;
  }, new Map<unknown, number>());

  let bestValue: unknown;
  let bestCount = -Infinity;

  for (const [value, count] of counts.entries()) {
    if (count > bestCount) {
      bestCount = count;
      bestValue = value;
    }
  }

  return bestValue;
}
