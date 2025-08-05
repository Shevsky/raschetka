import { FiscalRaw, FiscalReceiptRaw } from '~/persistence/raw';
import { BaseErrorOptions } from '~/utils/errors/base.error';
import { RuntimeError } from '~/utils/errors/runtime.error';
import { Either, Left, Right } from '~/utils/misc/either';

export enum ReceiptFromJSONDataErrorCode {
  /** Прислали не json */
  NOT_A_JSON = 'not_a_json',
  /** Прислали json, но какого-то другого формата */
  NOT_A_RECEIPT_JSON = 'not_a_receipt_json'
}

export class ReceiptFromJSONDataError extends RuntimeError {
  readonly code: ReceiptFromJSONDataErrorCode;

  constructor(code: ReceiptFromJSONDataErrorCode, options?: BaseErrorOptions) {
    super('Не удалось получить чек из json', options);

    this.code = code;
  }
}

/** Получить необработанный объект чека из json */
export function getReceiptFromJSONData(data: unknown): Either<ReceiptFromJSONDataError, FiscalReceiptRaw> {
  if (!data || typeof data !== 'object') {
    return new Left(new ReceiptFromJSONDataError(ReceiptFromJSONDataErrorCode.NOT_A_JSON));
  }

  const fiscal = (Array.isArray(data) ? (data[0] ?? {}) : data) as FiscalRaw;

  if (
    !('ticket' in fiscal) ||
    !fiscal.ticket ||
    !('document' in fiscal.ticket) ||
    !fiscal.ticket.document ||
    !('receipt' in fiscal.ticket.document) ||
    !fiscal.ticket.document.receipt
  ) {
    return new Left(new ReceiptFromJSONDataError(ReceiptFromJSONDataErrorCode.NOT_A_RECEIPT_JSON));
  }

  return new Right(fiscal.ticket.document.receipt);
}
