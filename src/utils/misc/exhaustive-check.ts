import { NonExhaustiveError } from '~/utils/errors/non-exhaustive.error';

export function exhaustiveCheck(value: never): never {
  throw new NonExhaustiveError(value);
}
