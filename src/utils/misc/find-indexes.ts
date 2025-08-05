export function findIndexes<T>(values: Array<T>, item: T): Array<number> {
  return values.map((iterableItem, index) => (iterableItem === item ? index : -1)).filter((index) => index !== -1);
}
