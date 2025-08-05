import { regexFromString } from '~/utils/misc/regex-from-string';

describe('regexFromString', () => {
  test('Создает регулярное выражение без специальных символов', () => {
    const query = 'some';
    const regex = regexFromString(query);

    expect('some').toMatch(regex);
    expect('some query').toMatch(regex);
    expect('my some query').toMatch(regex);
  });

  test('Регистронезависимое сравнение', () => {
    const query = 'CaseInsensitive';
    const regex = regexFromString(query);

    expect('caseinsensitive').toMatch(regex);
    expect('CASEINSENSITIVE').toMatch(regex);
  });

  test('Экранирует специальные символы регулярных выражений в пользовательском вводе', () => {
    const specialCharsString = '.*+?^${}()|[]\\';
    const specialChars = specialCharsString.split('');

    for (const specialChar of specialChars) {
      const regex = regexFromString(specialChar);
      expect(`test${specialChar}`).toMatch(regex);
    }
  });
});
