import { formatDate } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import { exhaustiveCheck } from '~/utils/misc/exhaustive-check';

type FormatLocaleDateConfig = {
  year?: boolean;
};

/** Форматирование даты согласно локали */
export function formatLocaleDate(date: Date | string, { year }: FormatLocaleDateConfig = {}): string {
  date = parseDate(date);

  return formatDate(date, 'd MMMM'.concat(year ? ' yyyy' : ''), { locale: ru });
}

function parseDate(date: Date | string): Date {
  switch (true) {
    case typeof date === 'string': {
      return new Date(date);
    }
    case date instanceof Date: {
      return date;
    }
    default: {
      return exhaustiveCheck(date);
    }
  }
}
