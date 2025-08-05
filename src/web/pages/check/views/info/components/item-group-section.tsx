import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { CheckItemGroupModel } from '~/persistence';
import { CalculatedItemGroupValues } from '~/utils/business/calculate-item-group-values';
import { ItemGroupSumCompactCard } from '~/web/components/cards/item-group-sum-compact-card';
import { CheckContext } from '~/web/pages/check/check.context';
import { CheckViewType } from '~/web/pages/check/check.views';

type ItemGroupSectionProps = {
  itemGroup: CheckItemGroupModel;
  values: CalculatedItemGroupValues;
};

export const ItemGroupSection = observer(({ itemGroup, values }: ItemGroupSectionProps) => {
  const store = useContext(CheckContext);

  const handleClick = () => {
    store.handleView({
      type: CheckViewType.SEE_ITEM_GROUP,
      payload: { id: itemGroup.id }
    });
  };

  return (
    <ItemGroupSumCompactCard
      itemGroup={itemGroup}
      sum={values.sum}
      undividedSum={values.undividedSum}
      participantsCount={values.participantsCount}
      onClick={handleClick}
      withChevron
    />
  );
});
