import { Box } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { ItemsSumCompactCard } from '~/web/components/cards/items-sum-compact-card';
import { TipsSumCompactCard } from '~/web/components/cards/tips-sum-compact-card';
import { TotalSumCompactCard } from '~/web/components/cards/total-sum-compact-card';
import { CheckContext } from '~/web/pages/check/check.context';
import { CheckViewType } from '~/web/pages/check/check.views';

export const CheckDetailsSection = observer(() => {
  const store = useContext(CheckContext);

  const check = store.check;

  const handleSeeItems = () => {
    store.handleView({
      type: CheckViewType.ITEMS
    });
  };

  return (
    <Box>
      <ItemsSumCompactCard sum={check.itemsSum} count={check.items!.length} onClick={handleSeeItems} withChevron />
      <TipsSumCompactCard sum={check.tipsSum} />
      <TotalSumCompactCard sum={check.totalSum} />
    </Box>
  );
});
