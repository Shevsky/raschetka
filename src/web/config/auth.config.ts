import { initData } from '@tma.js/sdk';
import { Permission, UserModel } from '~/persistence';
import { deferProxy } from '~/utils/misc/defer-proxy';
import { trpc } from '~/web/config/trpc.config';

let _currentUser: Nullish<UserModel> = null;

export const currentUser = deferProxy(() => _currentUser);

export async function authorize(): Promise<void> {
  _currentUser = await trpc.telegram.auth.mutate({ initDataRaw: initData.raw()! });
}

export function hasPermission(permission: Permission): boolean {
  return currentUser.permissions.includes(permission);
}
