import { formatMoney } from '~/utils/formatters/format-money';

describe('formatMoney', () => {
  test('Форматирует нулевую сумму', () => {
    expect(formatMoney(0)).toBeNormalized(`0 ₽`);
  });

  test('Форматирует целые рубли без копеек', () => {
    expect(formatMoney(2500)).toBeNormalized(`25 ₽`);
  });

  test('Форматирует рубли с двумя знаками после запятой', () => {
    expect(formatMoney(12345)).toBeNormalized(`123,45 ₽`);
  });

  test('Форматирует рубли с одним знаком после запятой', () => {
    expect(formatMoney(10050)).toBeNormalized(`100,5 ₽`);
  });

  test('Форматирует суммы меньше рубля (копейки)', () => {
    expect(formatMoney(5)).toBeNormalized(`0,05 ₽`);
  });

  test('Форматирует большие суммы с разделителями тысяч', () => {
    expect(formatMoney(123456789)).toBeNormalized(`1 234 567,89 ₽`);
  });

  test('Форматирует отрицательные суммы', () => {
    expect(formatMoney(-150)).toBeNormalized(`-1,5 ₽`);
  });
});
