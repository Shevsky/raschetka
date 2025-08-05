import { BaseError, BaseErrorOptions } from '~/utils/errors/base.error';

export class RuntimeError extends BaseError {
  constructor(message: string, options?: BaseErrorOptions) {
    super(message, options);
  }
}
