import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { ItemsSumCompactCard } from '~/web/components/cards/items-sum-compact-card';
import { TipsSumCompactCard } from '~/web/components/cards/tips-sum-compact-card';
import { TotalSumCompactCard } from '~/web/components/cards/total-sum-compact-card';
import { LabeledRow } from '~/web/components/rows/labeled-row';
import { CheckContext } from '~/web/pages/check/check.context';

export const TotalSection = observer(() => {
  const store = useContext(CheckContext);

  const check = store.check;
  const tipsSum = store.specifiedTipsSum;

  return (
    <LabeledRow name="Итого">
      <ItemsSumCompactCard sum={check.itemsSum} count={check.items!.length} />
      <TipsSumCompactCard sum={tipsSum} />
      <TotalSumCompactCard sum={check.itemsSum + tipsSum} />
    </LabeledRow>
  );
});
