import { BinaryLike, createHmac } from 'node:crypto';
import { BaseErrorOptions } from '~/utils/errors/base.error';
import { RuntimeError } from '~/utils/errors/runtime.error';
import { Either, Left, Right } from '~/utils/misc/either';

export enum TelegramInitDataErrorCode {
  HASHES_NOT_EQUAL = 'hashes_not_equal',
  EXPIRED_AUTH_DATE = 'expired_auth_date'
}

export class TelegramInitDataError extends RuntimeError {
  readonly code: TelegramInitDataErrorCode;

  constructor(code: TelegramInitDataErrorCode, options?: BaseErrorOptions) {
    super(`Невалидный Telegram init data: ${code}`, options);

    this.code = code;
  }
}

export class TelegramInitData {
  readonly user: { id: number };
  readonly authDate: Date;

  readonly hash: string;
  readonly dataCheckString: string;

  constructor(initData: string) {
    const params = new URLSearchParams(initData);

    this.user = JSON.parse(params.get('user')!) as { id: number };
    this.authDate = new Date(Number(params.get('auth_date')) * 1000);

    this.hash = params.get('hash')!;
    this.dataCheckString = [...params.entries()]
      .filter(([key]) => key !== 'hash')
      .toSorted(([aKey], [bKey]) => aKey.localeCompare(bKey))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
  }
}

export function parseTelegramInitData(initDataRaw: string, token: string, ttl: number): Either<TelegramInitDataError, TelegramInitData> {
  const initData = new TelegramInitData(initDataRaw);

  const secretKey = createHmac('sha256', 'WebAppData').update(token).digest();
  const computedHash = createHmac('sha256', secretKey as unknown as BinaryLike)
    .update(initData.dataCheckString)
    .digest('hex');

  if (initData.hash !== computedHash) {
    return new Left(new TelegramInitDataError(TelegramInitDataErrorCode.HASHES_NOT_EQUAL));
  }

  if (ttl < Infinity && Date.now() >= initData.authDate.getTime() + ttl * 1000) {
    return new Left(new TelegramInitDataError(TelegramInitDataErrorCode.EXPIRED_AUTH_DATE));
  }

  return new Right(initData);
}
