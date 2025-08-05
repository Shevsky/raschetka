export function shallowEqual(a: object, b: object): boolean {
  // Если оба объекта ссылаются на одно и то же место в памяти
  if (a === b) {
    return true;
  }

  // Если один из них не объект или null, то они не равны
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  // Если количество ключей не совпадает, объекты не равны
  if (aKeys.length !== bKeys.length) {
    return false;
  }

  // Проверяем, что значения по каждому ключу совпадают
  for (const key of aKeys) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}
