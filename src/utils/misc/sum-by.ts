/** Суммирует элементы массива по указанному ключу (если массив объектов), или просто суммирует числа */
export function sumBy<T extends object>(values: Array<T>, key: KeyofTyped<T, Nullish<number>>): number;
export function sumBy(values: Array<number>): number;
export function sumBy(values: Array<unknown>, key?: PropertyKey): number {
  return values.reduce<number>((acc, value) => acc + (Number(value && typeof value === 'object' && key ? value[key] : value) || 0), 0);
}
