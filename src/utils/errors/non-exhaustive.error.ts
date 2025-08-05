import { RuntimeError } from '~/utils/errors/runtime.error';

export class NonExhaustiveError extends RuntimeError {
  constructor(value: unknown) {
    super(`Не все значения учтены: ${JSON.stringify(value)}`);
  }
}
