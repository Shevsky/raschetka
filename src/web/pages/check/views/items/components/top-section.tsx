import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { formatMoney } from '~/utils/formatters/format-money';
import { formatPlural } from '~/utils/formatters/format-plural';
import { ItemsSumCompactCard } from '~/web/components/cards/items-sum-compact-card';
import { CheckContext } from '~/web/pages/check/check.context';

export const TopSection = observer(() => {
  const store = useContext(CheckContext);

  const check = store.check;
  const selectableItems = store.selectableItems;
  const selectableItemsSum = store.selectableItemsSum;

  return (
    <ItemsSumCompactCard
      sum={check.itemsSum}
      count={check.items!.length}
      description={
        selectableItems.length && selectableItems.length < check.items!.length
          ? `${formatPlural(selectableItems.length, '{} товар', '{} товара', '{} товаров')} на ${formatMoney(selectableItemsSum)} ещё не ${formatPlural(selectableItems.length, 'выбран', 'выбрано', 'выбрано')}`
          : undefined
      }
    />
  );
});
