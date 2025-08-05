/** Создает регулярное выражение из строки. Экранирует специальные символы, используемые в регулярных выражениях */
export function regexFromString(value: string): RegExp {
  return new RegExp(value.trim().replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`), 'i');
}
