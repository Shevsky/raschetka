import { Permission } from '~/persistence';

export const permissionsTitles: Record<Permission, string> = {
  [Permission.SEE_CHECKS]: 'Смотреть все чеки',
  [Permission.CREATE_CHECKS]: 'Создавать новые чеки',
  [Permission.SEE_USERS]: 'Смотреть всех пользователей',
  [Permission.EDIT_USERS]: 'Редактировать пользователей',
  [Permission.SEE_LOGS]: 'Читать логи'
};
