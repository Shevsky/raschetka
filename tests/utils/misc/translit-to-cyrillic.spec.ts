import { translitToCyrillic } from '~/utils/misc/translit-to-cyrillic';

describe('translitToCyrillic', () => {
  test('Переводит простые строки в нижнем регистре', () => {
    expect(translitToCyrillic('privet')).toBe('привет');
    expect(translitToCyrillic('ya')).toBe('я');
    expect(translitToCyrillic('max')).toBe('макс');
  });

  test('Сохраняет верхний регистр одиночных букв', () => {
    expect(translitToCyrillic('Privet')).toBe('Привет');
    expect(translitToCyrillic('HELLO')).toBe('ХЕЛЛО');
    expect(translitToCyrillic('Ya')).toBe('Я');
  });

  test('Правильно обрабатывает двойные буквы', () => {
    expect(translitToCyrillic('sch')).toBe('щ');
    expect(translitToCyrillic('Sch')).toBe('Щ');
    expect(translitToCyrillic('yozh')).toBe('ёж');
    expect(translitToCyrillic('YOZH')).toBe('ЁЖ');
    expect(translitToCyrillic('tsar')).toBe('цар');
    expect(translitToCyrillic('TsAr')).toBe('ЦАр');
  });

  test('Обрабатывает смешанный регистр внутри слова', () => {
    expect(translitToCyrillic('PrivEt')).toBe('ПривЕт');
    expect(translitToCyrillic('ScHastE')).toBe('ЩастЕ');
  });

  test('Не должен трогать символы, не попавшие в мапу', () => {
    const input = '1234! @#$ English';
    expect(translitToCyrillic(input)).toBe('1234! @#$ Енглиш');
    // Здесь 'sh' внутри 'English' превратится в 'ш'
  });

  test('Корректно обрабатывает последовательности пересекающихся правил', () => {
    // проверяем, что 'sch' обрабатывается раньше, чем 'sh'+'ch'
    expect(translitToCyrillic('schshch')).toBe('щшч');
  });
});
