import { clearPhoneNumber, formatPhoneNumber } from '~/utils/formatters/format-phone-number';

describe('clearPhoneNumber', () => {
  test('Очищает номер от лишних символов и заменяет ведущую 8 на 7', () => {
    expect(clearPhoneNumber('8 (912) 345-67-89')).toBe('+79123456789');
    expect(clearPhoneNumber('+7 912 345 67 89')).toBe('+79123456789');
    expect(clearPhoneNumber('89123456789')).toBe('+79123456789');
    expect(clearPhoneNumber('7-912-345-67-89')).toBe('+79123456789');
  });
});

describe('formatPhoneNumber', () => {
  test('Не форматирует короткие или некорректные номера в formatPhoneNumber', () => {
    expect(formatPhoneNumber('12345')).toBe('12345');
    expect(formatPhoneNumber('+7ABCDEF0123')).toBe('+7ABCDEF0123');
    expect(formatPhoneNumber('+7 912 345 678')).toBe('+7 912 345 678');
  });

  test('Форматирует корректный номер в международном виде с разделителями', () => {
    const raw = '8 (912) 345-67-89';
    const formatted = formatPhoneNumber(raw);

    expect(formatted).toBeNormalized('+7 912 345-67-89');
  });

  test('Не трогает уже отформатированный номер', () => {
    const already = '+7 912 345-67-89';

    expect(formatPhoneNumber(already)).toBeNormalized(already);
  });

  test('Обрабатывает номера с разными нецифровыми разделителями', () => {
    const inputs = ['+7-912-345-67-89', '+7 (912) 345 67 89', '+7.912.345.67.89', '8 912 345 67 89'];

    inputs.forEach((input) => {
      expect(formatPhoneNumber(input)).toBeNormalized('+7 912 345-67-89');
    });
  });
});
