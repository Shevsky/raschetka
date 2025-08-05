import { formatLocaleDate } from '~/utils/formatters/format-locale-date';

describe('formatLocaleDate', () => {
  test('Форматирует строку даты без года', () => {
    expect(formatLocaleDate('2025-06-30')).toBe('30 июня');
    expect(formatLocaleDate('2021-12-01')).toBe('1 декабря');
  });

  test('Форматирует строку даты с указанием года', () => {
    expect(formatLocaleDate('2025-06-30', { year: true })).toBe('30 июня 2025');
    expect(formatLocaleDate('1999-01-15', { year: true })).toBe('15 января 1999');
  });

  test('Форматирует объект Date без года', () => {
    const date = new Date(2022, 0, 5); // 5 января 2022

    expect(formatLocaleDate(date)).toBe('5 января');
  });

  test('Форматирует объект Date с указанием года', () => {
    const date = new Date(2022, 0, 5); // 5 января 2022

    expect(formatLocaleDate(date, { year: true })).toBe('5 января 2022');
  });

  test('Корректно обрабатывает разные языковые месяцы', () => {
    expect(formatLocaleDate('2023-03-10')).toBe('10 марта');
    expect(formatLocaleDate('2023-11-25', { year: true })).toBe('25 ноября 2023');
  });
});
