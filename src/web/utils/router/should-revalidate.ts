import { ShouldRevalidateFunctionArgs } from 'react-router-dom';
import { shallowEqual } from '~/utils/misc/shallow-equal';

export function shouldRevalidate(args: ShouldRevalidateFunctionArgs): boolean {
  return !shallowEqual(args.currentParams, args.nextParams);
}
