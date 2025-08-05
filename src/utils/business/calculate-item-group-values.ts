import { CheckItemGroupModel } from '~/persistence';
import { sumBy } from '~/utils/misc/sum-by';

export type CalculatedItemGroupValues = {
  /** Общая сумма по группе товаров */
  undividedSum: number;
  /** Количество участников в группе товаров */
  participantsCount: number;
  /** Сумма на человека (поделенная на количество участников в группе) */
  sum: number;
};

export function calculateItemGroupValues(itemGroup: CheckItemGroupModel): CalculatedItemGroupValues {
  const undividedSum = sumBy(itemGroup.items!, 'sum');
  const participantsCount = itemGroup.participants!.length;
  const sum = Math.round(undividedSum / participantsCount);

  return { undividedSum, participantsCount, sum };
}
