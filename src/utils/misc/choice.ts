/** Выбирает случайный элемент массива */
export function choice<T>(values: Array<T>): T {
  return values[Math.floor(Math.random() * values.length)];
}
