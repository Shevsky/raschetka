import { match } from 'ts-pattern';
import { UserModel } from '~/persistence';

type Target = UserModel;

export enum UsersSorter {
  CREATED_AT = 'created_at',
  NAME = 'name'
}

export const usersSortVariants: Record<UsersSorter, string> = {
  [UsersSorter.CREATED_AT]: 'По дате регистрации',
  [UsersSorter.NAME]: 'По имени'
};

export function getUsersComparer(sorter: UsersSorter, order: Order): (a: Target, b: Target) => number {
  return (a, b) =>
    order *
    match(sorter)
      .with(UsersSorter.CREATED_AT, () => -1 * (a.createdAt.getTime() - b.createdAt.getTime()))
      .with(UsersSorter.NAME, () => a.name.localeCompare(b.name))
      .exhaustive();
}
