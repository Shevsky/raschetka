import { test, expect } from 'vitest';
import { formatPlural } from '~/utils/formatters/format-plural';

describe('formatPlural', () => {
  test('Форматирует для одного элемента', () => {
    expect(formatPlural(1, '{} товар', '{} товара', '{} товаров')).toBe('1 товар');
  });

  test('Форматирует для нескольких элементов (2–4)', () => {
    expect(formatPlural(3, '{} товар', '{} товара', '{} товаров')).toBe('3 товара');
  });

  test('Форматирует для многих элементов (0, 5 и более)', () => {
    const one = '{} задание';
    const few = '{} задания';
    const many = '{} заданий';

    expect(formatPlural(0, one, few, many)).toBe('0 заданий');
    expect(formatPlural(5, one, few, many)).toBe('5 заданий');
  });

  test('Учитывает сложные случаи русского языка (11, 21, 22)', () => {
    const one = '{} яблоко';
    const few = '{} яблока';
    const many = '{} яблок';

    expect(formatPlural(11, one, few, many)).toBe('11 яблок');
    expect(formatPlural(21, one, few, many)).toBe('21 яблоко');
    expect(formatPlural(22, one, few, many)).toBe('22 яблока');
  });

  test('Если строка не содержит плейсхолдера, возвращает исходную форму', () => {
    const one = 'товар';
    const few = 'товара';
    const many = 'товаров';

    expect(formatPlural(2, one, few, many)).toBe(few);
    expect(formatPlural(5, one, few, many)).toBe(many);
  });

  test('Заменяет все плейсхолдеры в строке', () => {
    expect(formatPlural(3, '{} товар — всего {}', '{} товара — всего {}', '{} товаров — всего {}')).toBe('3 товара — всего 3');
  });
});
