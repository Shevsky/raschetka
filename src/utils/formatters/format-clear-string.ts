/** Очищает строку от мусорных символов, оставляя только буквы, цифры и пробелы */
export function formatClearString(value: string): string {
  return value.replaceAll(/[^а-яёЁ\w\s]/gi, '').trim();
}
