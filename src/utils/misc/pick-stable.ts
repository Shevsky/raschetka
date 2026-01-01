import { hash } from '~/utils/misc/hash';

/** Стабильно выбирает элемент из списка по ключу */
export function pickStable<T>(values: Array<T>, key: string): T {
  return values[hash(key) % values.length];
}
