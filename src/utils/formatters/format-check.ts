import { CheckModel } from '~/persistence';
import { formatClearString } from '~/utils/formatters/format-clear-string';
import { formatLocaleDate } from '~/utils/formatters/format-locale-date';
import { formatMoney } from '~/utils/formatters/format-money';
import { clearPhoneNumber, formatPhoneNumber } from '~/utils/formatters/format-phone-number';

export function formatCheckTitle(check: CheckModel): string {
  return check.title || check.retailPlaceName || check.companyName;
}

export function formatCheckTransactionAt(check: CheckModel, year: boolean = false): string {
  return `От ${formatLocaleDate(check.transactionAt, { year })}`;
}

export function formatCheckTotalSum(check: CheckModel): string {
  return `На ${formatMoney(check.totalSum)}`;
}

export function formatCheckFull(check: CheckModel): string {
  return [formatCheckTitle(check), formatCheckTransactionAt(check).toLowerCase(), formatCheckTotalSum(check).toLowerCase()]
    .filter(Boolean)
    .join(' ');
}

export function formatCheckInitials(check: CheckModel): string {
  return (
    formatClearString(check.title || check.retailPlaceName || check.companyName)
      .replaceAll(/ИП|ООО/g, '')
      .trim()
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      .split(' ', 2)
      .map((part) => part.slice(0, 1))
      .join('')
      .toUpperCase()
  );
}

export function formatCheckComment(check: CheckModel): string {
  return check.comment.replaceAll(/((?:\+7|8)[\d-]+)/g, (_, m1) => {
    return `<a href="tel:${clearPhoneNumber(m1)}">${formatPhoneNumber(m1)}</a>`;
  });
}
