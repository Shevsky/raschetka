/** Форматирование для склонений */
export function formatPlural(value: number, one: string, few: string, many: string): string {
  const category = new Intl.PluralRules('ru-RU').select(value);

  return (category === 'one' ? one : category === 'few' ? few : many).replaceAll('{}', value.toString());
}
