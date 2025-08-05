import { BaseError } from '~/utils/errors/base.error';

export class CanceledError extends BaseError {
  constructor() {
    super('Операция отменена');
  }
}
