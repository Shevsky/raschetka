/** Переключатель значения внутри массива */
export function toggle<T>(
  array: Array<T>,
  item: T,
  { state, isEqual: isEqualFn = Object.is }: { state?: boolean; isEqual?: (a: T, b: T) => boolean } = {}
): Array<T> {
  const copy = [...array];
  const index = copy.findIndex((iterableItem: T) => isEqualFn(item, iterableItem));

  if (index === -1 && (state || state === undefined)) {
    copy.push(item);
  } else if (index !== -1 && !state) {
    copy.splice(index, 1);
  }

  return copy;
}
