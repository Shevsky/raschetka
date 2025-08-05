import { failReactions } from '~/utils/dicts/reactions.dict';
import { choice } from '~/utils/misc/choice';

export function describeError(error: unknown): [title: string, subtitle: string, stack?: Array<string>] {
  return [
    choice(failReactions),
    error instanceof Error ? error.message : 'Что-то пошло не так... Можно попробовать ещё раз или зайти сюда позже',
    import.meta.env.DEV && error instanceof Error && error.stack && error.stack.length > 1 ? error.stack.split('\n').slice(1) : undefined
  ];
}
