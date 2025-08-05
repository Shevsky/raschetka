export type BaseErrorOptions = ErrorOptions & {
  code?: string;
  meta?: object;
};

export abstract class BaseError extends Error {
  readonly code?: string;
  readonly meta?: object;

  constructor(message: string, options?: BaseErrorOptions) {
    super(message, options);

    this.name = new.target.prototype.constructor.name;
    this.code = options?.code;
    this.meta = options?.meta;

    Object.defineProperty(this, 'message', { enumerable: true });
  }
}
