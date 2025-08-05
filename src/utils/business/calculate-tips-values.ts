import { CheckModel } from '~/persistence';

export type CalculatedTipsValues = {
  /** Общая сумма чаевых */
  undividedSum: number;
  /** Количество участников */
  participantsCount: number;
  /** Сумма для человека (поделенная на количество участников) */
  sum: number;
};

export function calculateTipsValues(check: CheckModel): Nullish<CalculatedTipsValues> {
  const undividedSum = check.tipsSum;

  if (!undividedSum) {
    return null;
  }

  const participantsCount = check.participants!.length;
  const sum = Math.round(undividedSum / participantsCount);

  return { undividedSum, participantsCount, sum };
}
