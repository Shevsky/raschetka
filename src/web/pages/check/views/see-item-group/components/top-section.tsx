import { CheckItemGroupModel } from '~/persistence';
import { CalculatedItemGroupValues } from '~/utils/business/calculate-item-group-values';
import { ItemGroupSumCompactCard } from '~/web/components/cards/item-group-sum-compact-card';

type TopSectionProps = {
  itemGroup: CheckItemGroupModel;
  values: CalculatedItemGroupValues;
};

export const TopSection = ({ itemGroup, values }: TopSectionProps) => {
  return (
    <ItemGroupSumCompactCard
      itemGroup={itemGroup}
      sum={values.sum}
      undividedSum={values.undividedSum}
      participantsCount={values.participantsCount}
    />
  );
};
