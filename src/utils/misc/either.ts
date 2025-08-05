export class Left<L> {
  readonly error: L;

  constructor(error: L) {
    this.error = error;
  }
}

export class Right<R = void> {
  readonly value: R;

  constructor(...args: R extends void ? [] : [R]) {
    this.value = args[0] as R;
  }
}

export type Either<L, R> = Left<L> | Right<R>;
