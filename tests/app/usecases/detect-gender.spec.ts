import { detectGender } from '~/app/usecases/detect-gender.usecase';
import { Gender } from '~/persistence';

describe('detectGender', () => {
  test('Русские мужские имена на кириллице', () => {
    expect(detectGender('Иван')).toBe(Gender.MALE);
    expect(detectGender('Ваня')).toBe(Gender.MALE);
    expect(detectGender('Максим')).toBe(Gender.MALE);
    expect(detectGender('Макс')).toBe(Gender.MALE);
    expect(detectGender('Алекс')).toBe(Gender.MALE);
    expect(detectGender('Алексей')).toBe(Gender.MALE);
    expect(detectGender('Лёша')).toBe(Gender.MALE);
    expect(detectGender('Леша')).toBe(Gender.MALE);
    expect(detectGender('Лёха')).toBe(Gender.MALE);
    expect(detectGender('Леха')).toBe(Gender.MALE);
    expect(detectGender('Павел')).toBe(Gender.MALE);
    expect(detectGender('Паша')).toBe(Gender.MALE);
    expect(detectGender('Константин')).toBe(Gender.MALE);
    expect(detectGender('Костя')).toBe(Gender.MALE);
    expect(detectGender('Дмитрий')).toBe(Gender.MALE);
    expect(detectGender('Дима')).toBe(Gender.MALE);
    expect(detectGender('Димон')).toBe(Gender.MALE);
  });

  test('Русские мужские имена на латинице', () => {
    expect(detectGender('Ivan')).toBe(Gender.MALE);
    expect(detectGender('Vanya')).toBe(Gender.MALE);
    expect(detectGender('Maksim')).toBe(Gender.MALE);
    expect(detectGender('Maxim')).toBe(Gender.MALE);
    expect(detectGender('Maks')).toBe(Gender.MALE);
    expect(detectGender('Max')).toBe(Gender.MALE);
    expect(detectGender('Alex')).toBe(Gender.MALE);
    expect(detectGender('Aleks')).toBe(Gender.MALE);
    expect(detectGender('Alexey')).toBe(Gender.MALE);
    expect(detectGender('Aleksey')).toBe(Gender.MALE);
    expect(detectGender('Lyosha')).toBe(Gender.MALE);
    expect(detectGender('Lesha')).toBe(Gender.MALE);
    expect(detectGender('Lyoha')).toBe(Gender.MALE);
    expect(detectGender('Leha')).toBe(Gender.MALE);
    expect(detectGender('Pavel')).toBe(Gender.MALE);
    expect(detectGender('Pasha')).toBe(Gender.MALE);
    expect(detectGender('Konstantin')).toBe(Gender.MALE);
    expect(detectGender('Kostya')).toBe(Gender.MALE);
    expect(detectGender('Dmitry')).toBe(Gender.MALE);
    expect(detectGender('Dmitriy')).toBe(Gender.MALE);
    expect(detectGender('Dima')).toBe(Gender.MALE);
    expect(detectGender('Dimon')).toBe(Gender.MALE);
  });

  test('Русские женские имена на кириллице', () => {
    expect(detectGender('Мария')).toBe(Gender.FEMALE);
    expect(detectGender('Маша')).toBe(Gender.FEMALE);
    expect(detectGender('Екатерина')).toBe(Gender.FEMALE);
    expect(detectGender('Катя')).toBe(Gender.FEMALE);
    expect(detectGender('Ольга')).toBe(Gender.FEMALE);
    expect(detectGender('Оля')).toBe(Gender.FEMALE);
    expect(detectGender('Елена')).toBe(Gender.FEMALE);
    expect(detectGender('Лена')).toBe(Gender.FEMALE);
    expect(detectGender('Светлана')).toBe(Gender.FEMALE);
    expect(detectGender('Света')).toBe(Gender.FEMALE);
    expect(detectGender('Наталья')).toBe(Gender.FEMALE);
    expect(detectGender('Наташа')).toBe(Gender.FEMALE);
    expect(detectGender('Татьяна')).toBe(Gender.FEMALE);
    expect(detectGender('Таня')).toBe(Gender.FEMALE);
  });

  test('Русские женские имена на латинице', () => {
    expect(detectGender('Maria')).toBe(Gender.FEMALE);
    expect(detectGender('Masha')).toBe(Gender.FEMALE);
    expect(detectGender('Yekaterina')).toBe(Gender.FEMALE);
    expect(detectGender('Ekaterina')).toBe(Gender.FEMALE);
    expect(detectGender('Katya')).toBe(Gender.FEMALE);
    expect(detectGender('Olga')).toBe(Gender.FEMALE);
    expect(detectGender('Olya')).toBe(Gender.FEMALE);
    expect(detectGender('Elena')).toBe(Gender.FEMALE);
    expect(detectGender('Lena')).toBe(Gender.FEMALE);
    expect(detectGender('Svetlana')).toBe(Gender.FEMALE);
    expect(detectGender('Sveta')).toBe(Gender.FEMALE);
    expect(detectGender('Natalya')).toBe(Gender.FEMALE);
    expect(detectGender('Natasha')).toBe(Gender.FEMALE);
    expect(detectGender('Tatyana')).toBe(Gender.FEMALE);
    expect(detectGender('Tanya')).toBe(Gender.FEMALE);
  });

  test('Корректно работает если в имени куча шлака', () => {
    expect(detectGender('😊Мария💖')).toBe(Gender.FEMALE);
    expect(detectGender('!!Павел!!')).toBe(Gender.MALE);
    expect(detectGender('#Константин#')).toBe(Gender.MALE);
    expect(detectGender('  Дмитрий  ')).toBe(Gender.MALE);
    expect(detectGender('👨‍💻Алексей🚀')).toBe(Gender.MALE);
    expect(detectGender('—Оля—')).toBe(Gender.FEMALE);
    expect(detectGender('Таня!!!')).toBe(Gender.FEMALE);
    expect(detectGender('🧖🏼На💃🏻Та🙇🏼‍♀️Ша🙍🏼‍♀️')).toBe(Gender.FEMALE);
  });
});
