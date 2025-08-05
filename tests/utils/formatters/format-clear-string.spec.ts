import { formatClearString } from '~/utils/formatters/format-clear-string';

describe('formatClearString', () => {
  test('Удаляет знаки препинания и специальные символы', () => {
    const input = 'Привет, мир!';

    expect(formatClearString(input)).toBe('Привет мир');
  });

  test('Оставляет буквы, цифры и пробелы', () => {
    const input = 'Тест 123 ABC';

    expect(formatClearString(input)).toBe('Тест 123 ABC');
  });

  test('Удаляет эмодзи и нестандартные символы', () => {
    const input = 'Тест😊 string🚀';

    expect(formatClearString(input)).toBe('Тест string');
  });

  test('Убирает символы в начале и конце и обрезает пробелы', () => {
    const input = '   @@Hello  World!!  ';

    expect(formatClearString(input)).toBe('Hello  World');
  });

  test('Обрабатывает строку с номером заказа и спецсимволами', () => {
    const input = 'Заказ №12345: готов!';

    expect(formatClearString(input)).toBe('Заказ 12345 готов');
  });

  test('Возвращает пустую строку, если нет допустимых символов', () => {
    const input = '***///$$$';

    expect(formatClearString(input)).toBe('');
  });
});
