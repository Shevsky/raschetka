import { CheckStatus } from '~/persistence';

export const checkStatusesTitles: Record<CheckStatus, string> = {
  [CheckStatus.DRAFT]: 'Черновик',
  [CheckStatus.ACTIVE]: 'Активный',
  [CheckStatus.COMPLETED]: 'Завершён',
  [CheckStatus.ARCHIVE]: 'Архивный'
};

export const checkStatusesColors = {
  [CheckStatus.DRAFT]: 'gray',
  [CheckStatus.ACTIVE]: 'green',
  [CheckStatus.COMPLETED]: 'blue',
  [CheckStatus.ARCHIVE]: 'gray'
} satisfies Record<CheckStatus, string>;
