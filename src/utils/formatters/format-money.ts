/** Форматирование денег. Принимаем копейки, возвращаем рубли */
export function formatMoney(value: number): string {
  return `${Number(value / 100).toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ₽`;
}
