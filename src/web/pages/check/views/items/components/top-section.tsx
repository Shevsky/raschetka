import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { ItemsSumCompactCard } from '~/web/components/cards/items-sum-compact-card';
import { CheckContext } from '~/web/pages/check/check.context';

export const TopSection = observer(() => {
  const store = useContext(CheckContext);

  const check = store.check;

  return <ItemsSumCompactCard sum={check.itemsSum} count={check.items!.length} />;
});
