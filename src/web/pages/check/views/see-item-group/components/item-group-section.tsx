import { CheckItemGroupModel } from '~/persistence';
import { CalculatedItemGroupValues } from '~/utils/business/calculate-item-group-values';
import { formatMoney } from '~/utils/formatters/format-money';
import { ItemCompactCard } from '~/web/components/cards/item-compact-card';
import { LabeledRow } from '~/web/components/rows/labeled-row';

type ItemGroupSectionProps = {
  itemGroup: CheckItemGroupModel;
  values: CalculatedItemGroupValues;
};

export const ItemGroupSection = ({ itemGroup, values }: ItemGroupSectionProps) => {
  return (
    <LabeledRow name={itemGroup.name} description={formatMoney(values.sum)}>
      {itemGroup.items!.map((item) => (
        <ItemCompactCard key={item.id} item={item} divideBy={values.participantsCount} />
      ))}
    </LabeledRow>
  );
};
