/** Переводит строку, написанную транслитом, в кириллицу. Работает по словарю */
export function translitToCyrillic(value: string): string {
  return transliterates.reduce((acc, [from, to]) => {
    const regex = new RegExp(from, 'gi');

    return acc.replace(regex, (match) => (match[0] === match[0].toUpperCase() ? to.toUpperCase() : to));
  }, value);
}

// Мапа для транслитерации
// prettier-ignore
const transliterates: Array<[string, string]> = [
  // Двойные буквы
  ['sch', 'щ'], ['yo', 'ё'], ['yu', 'ю'],
  ['ya', 'я'], ['zh', 'ж'], ['kh', 'х'],
  ['ts', 'ц'], ['ch', 'ч'], ['sh', 'ш'],
  // Одиночные буквы
  ['a', 'а'], ['b', 'б'], ['v', 'в'], ['g', 'г'],
  ['d', 'д'], ['e', 'е'], ['z', 'з'], ['i', 'и'],
  ['j', 'й'], ['k', 'к'], ['l', 'л'], ['m', 'м'],
  ['n', 'н'], ['o', 'о'], ['p', 'п'], ['r', 'р'],
  ['s', 'с'], ['t', 'т'], ['u', 'у'], ['f', 'ф'],
  ['h', 'х'], ['c', 'ц'], ['y', 'ы'], ['x', 'кс'],
];
