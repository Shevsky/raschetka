import { CheckItemGroupModel, CheckModel, CheckParticipantModel } from '~/persistence/models';
import { calculateItemGroupValues } from '~/utils/business/calculate-item-group-values';
import { calculateParticipantItemsSum } from '~/utils/business/calculate-participant-items-sum';
import { calculateTipsValues } from '~/utils/business/calculate-tips-values';
import { sumBy } from '~/utils/misc/sum-by';

type CalculatedParticipantSums = {
  /** Сумма по выбранным товарам */
  itemsSum: number;
  /** Суммы по группам товаров (поделенные на количество участников в группе) */
  itemGroupsSums: Map<CheckItemGroupModel, number>;
  /** Сумма по чаевым (поделенная на количество участников) */
  tipsSum: number;
  /** Общая сумма: сложили всё что выше ⬆️ */
  totalSum: number;
};

export function calculateParticipantSums(check: CheckModel, participant: CheckParticipantModel): CalculatedParticipantSums {
  const itemsSum = calculateParticipantItemsSum(participant);
  const itemGroupsSums = new Map(
    participant.itemGroups!.map(
      (itemGroup) =>
        [
          itemGroup,
          calculateItemGroupValues(
            // Находим модель из чека, потому что она более полная
            check.itemGroups!.find((iterableItemGroup) => iterableItemGroup.id === itemGroup.id)!
          ).sum
        ] satisfies [CheckItemGroupModel, number]
    )
  );
  const tipsSum = calculateTipsValues(check)?.sum ?? 0;
  const totalSum = sumBy(Array.from(itemGroupsSums.values())) + itemsSum + tipsSum;

  return {
    itemGroupsSums,
    itemsSum,
    tipsSum,
    totalSum
  };
}
