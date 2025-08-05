import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { formatMoney } from '~/utils/formatters/format-money';
import { ItemCompactCard } from '~/web/components/cards/item-compact-card';
import { LabeledRow } from '~/web/components/rows/labeled-row';
import { CheckContext } from '~/web/pages/check/check.context';

export const PickedItemsSection = observer(() => {
  const store = useContext(CheckContext);

  const itemsSum = store.selfPickedItemsSum;
  const items = store.selfPickedItems;

  return (
    <LabeledRow name="Выбранные товары" description={formatMoney(itemsSum)}>
      {items.map((item) => (
        <ItemCompactCard key={item.id} item={item} />
      ))}
    </LabeledRow>
  );
});
