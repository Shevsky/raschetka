import { getFirstnameGender } from 'lvovich';
import { Gender } from '~/persistence';
import { isCyrillic } from '~/utils/misc/is-cyrillic';
import { translitToCyrillic } from '~/utils/misc/translit-to-cyrillic';

/** Функция для распознавания пола по одному имени. Работает локально по словарю, ни в какие AI не лезет */
export function detectGender(name: string): Nullish<Gender> {
  // Нормализуем имя, удаляя из него небуквенные символы, в том числе emoji
  name = name
    .toLowerCase()
    .replaceAll(/[^\p{L}]+/gu, '')
    .trim();

  if (!name) {
    return null;
  }

  // Если кириллицы в имени нет, то делаем обратную транслитерацию
  name = isCyrillic(name) ? name : translitToCyrillic(name);

  if (name in overrides) {
    return overrides[name];
  }

  const gender = getFirstnameGender(name);

  switch (gender) {
    case 'male': {
      return Gender.MALE;
    }
    case 'female': {
      return Gender.FEMALE;
    }
    default: {
      return null;
    }
  }
}

// Особые случаи, которые lvovich не умеет ловить
// prettier-ignore
const overrides: Record<string, Gender> = {
  'таня': Gender.FEMALE,
  'маша': Gender.FEMALE,
  'леша': Gender.MALE,
  'лёша': Gender.MALE,
  'леха': Gender.MALE,
  'лёха': Gender.MALE,
};
