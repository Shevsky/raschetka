import { Box } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { CheckContext } from '~/web/pages/check/check.context';
import { ItemSection } from '~/web/pages/check/views/pick-items/components/item-section';

export const ItemsSection = observer(() => {
  const store = useContext(CheckContext);

  const selectableItems = store.selectableItems;

  return (
    <Box>
      {selectableItems.map((item) => (
        <ItemSection key={item.id} item={item} />
      ))}
    </Box>
  );
});
