/// <reference types="vitest" />
/// <reference types="vitest/globals" />

declare namespace jest {
  interface Matchers<R> {
    toBeNullish(): R;
    toBeNormalized(expected: string): R;
  }
}
