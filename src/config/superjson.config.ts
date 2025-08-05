import SuperJSON, { parse, stringify } from 'superjson';
import { CanceledError } from '~/utils/errors/canceled.error';
import { InvalidArgumentError } from '~/utils/errors/invalid-argument.error';
import { NonExhaustiveError } from '~/utils/errors/non-exhaustive.error';
import { RuntimeError } from '~/utils/errors/runtime.error';
import { Either, Left, Right } from '~/utils/misc/either';

export function configureSuperjson(): void {
  SuperJSON.allowErrorProps('code', 'meta');

  SuperJSON.registerClass(CanceledError);
  SuperJSON.registerClass(InvalidArgumentError);
  SuperJSON.registerClass(NonExhaustiveError);
  SuperJSON.registerClass(RuntimeError);

  SuperJSON.registerCustom<Either<unknown, unknown>, { either: 'left' | 'right'; data: string }>(
    {
      isApplicable: (v) => v instanceof Left || v instanceof Right,
      serialize: (v) => (v instanceof Left ? { either: 'left', data: stringify(v.error) } : { either: 'right', data: stringify(v.value) }),
      deserialize: (v) => (v.either === 'left' ? new Left(parse(v.data)) : new Right(parse(v.data)))
    },
    'either'
  );
}
