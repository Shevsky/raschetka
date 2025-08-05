import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { ParticipantItemsSumCompactCard } from '~/web/components/cards/participant-items-sum-compact-card';
import { TipsSumCompactCard } from '~/web/components/cards/tips-sum-compact-card';
import { TotalSumCompactCard } from '~/web/components/cards/total-sum-compact-card';
import { LabeledRow } from '~/web/components/rows/labeled-row';
import { CheckContext } from '~/web/pages/check/check.context';
import { ItemGroupSection } from '~/web/pages/check/views/confirm-picked-items/components/item-group-section';

export const TotalSection = observer(() => {
  const store = useContext(CheckContext);

  const tipsValues = store.tipsValues;
  const itemGroups = store.selfItemGroups;
  const itemGroupsValues = store.itemGroupsValues;
  const prevItemsSum = store.selfPrevPickedItemsSum;
  const prevItemsCount = store.selfPrevPickedItemsCount;
  const itemsSum = store.selfPickedItemsSum;
  const itemsCount = store.selfPickedItemIds.length;
  const totalSum = store.selfPendingTotalSum;

  return (
    <LabeledRow name="Итого">
      {prevItemsCount > 0 && <ParticipantItemsSumCompactCard type="prev" sum={prevItemsSum} count={prevItemsCount} />}
      <ParticipantItemsSumCompactCard type="current" sum={itemsSum} count={itemsCount} />
      {itemGroups.map((itemGroup) => (
        <ItemGroupSection key={itemGroup.id} itemGroup={itemGroup} values={itemGroupsValues.get(itemGroup.id)!} />
      ))}
      {tipsValues && (
        <TipsSumCompactCard sum={tipsValues.sum} undividedSum={tipsValues.undividedSum} participantsCount={tipsValues.participantsCount} />
      )}
      <TotalSumCompactCard sum={totalSum} />
    </LabeledRow>
  );
});
