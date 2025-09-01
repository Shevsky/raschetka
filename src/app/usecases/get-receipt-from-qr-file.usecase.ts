import { proverkaChekaClient } from '~/app/clients/proverka-cheka.client';
import { decodeQRData } from '~/app/usecases/decode-qr-data.usecase';
import { FiscalReceiptRaw } from '~/persistence/raw';
import { BaseErrorOptions } from '~/utils/errors/base.error';
import { RuntimeError } from '~/utils/errors/runtime.error';
import { Either, Left, Right } from '~/utils/misc/either';

export enum ReceiptFromQRFileErrorCode {
  /** QR код на фото не найден */
  QR_NOT_FOUND = 'qr_not_found',
  /** QR код найден, но там не фискальный чек */
  NOT_A_FISCAL_QR = 'not_a_fiscal_qr',
  /** QR код прочитали, но затем другая ошибка */
  QR_PARSED_BUT_ERROR = 'qr_parsed_but_error',
  /** QR код не смогли прочитать, отправили на проверку чека как есть и словили ошибку */
  QR_AS_IS_USED_BUT_ERROR = 'qr_as_is_used_but_error'
}

export class ReceiptFromQRFileError extends RuntimeError {
  readonly code: ReceiptFromQRFileErrorCode;

  constructor(code: ReceiptFromQRFileErrorCode, options?: BaseErrorOptions) {
    super(`Не удалось получить чек из QR кода: ${code}`, options);

    this.code = code;
  }
}

/** Получить необработанный объект чека из файла с QR кодом */
export async function getReceiptFromQRFile(buffer: ArrayBuffer): Promise<Either<ReceiptFromQRFileError, FiscalReceiptRaw>> {
  const data = await decodeQRData(buffer);

  if (data) {
    // Если смогли распознать QR код, то надо проверить что в нём прежде чем отправлять в сервис
    // В правильном QR коде фискальника должна быть строка с query параметрами вида t=123&s=4567.89&fn=123&i=456&fp=789&n=0
    const params = new URLSearchParams(data);

    // Базово проверяем что количество параметров больше 1 и есть два значимых параметра
    if (params.size <= 1 || !params.has('t') || !params.has('s')) {
      return new Left(new ReceiptFromQRFileError(ReceiptFromQRFileErrorCode.NOT_A_FISCAL_QR));
    }

    return proverkaChekaClient
      .getReceiptByQRData(data)
      .then((receipt) => new Right(receipt))
      .catch((error) => new Left(new ReceiptFromQRFileError(ReceiptFromQRFileErrorCode.QR_PARSED_BUT_ERROR, { cause: error })));
  } else {
    // Если QR код распознать не получилось, то посылаем фотку as is в сервис проверки чеков, мб он справится с этим
    return proverkaChekaClient
      .getReceiptByQRFile(buffer)
      .then((receipt) => new Right(receipt))
      .catch((error) => new Left(new ReceiptFromQRFileError(ReceiptFromQRFileErrorCode.QR_AS_IS_USED_BUT_ERROR, { cause: error })));
  }
}
