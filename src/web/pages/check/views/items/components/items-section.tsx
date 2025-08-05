import { Box, Group, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useContext, useMemo, useState } from 'react';
import { getItemsComparer, ItemsSorter, itemsSortVariants } from '~/utils/business/sort-items';
import { ItemSelectableCompactCard } from '~/web/components/cards/item-selectable-compact-card';
import { ListViewControl } from '~/web/components/controls/list-view-control';
import { SortControl } from '~/web/components/controls/sort-control';
import { CheckContext } from '~/web/pages/check/check.context';

export const ItemsSection = observer(() => {
  const store = useContext(CheckContext);

  const items = store.check.items!;
  const unassignedItems = store.check.items!.filter((item) => !item.groupId && !item.participantId);

  const [all, setAll] = useState(true);
  const [sorter, setSorter] = useState(ItemsSorter.INDEX);
  const [order, setOrder] = useState<Order>(1);

  const comparer = useMemo(() => getItemsComparer(sorter, order), [sorter, order]);

  const visibleItems = useMemo(() => (all ? items : unassignedItems).toSorted(comparer), [items, unassignedItems, all, comparer]);

  return (
    <Box>
      <Stack gap="lg">
        <Stack gap="md">
          <Group justify="space-between" wrap="nowrap">
            <ListViewControl type="unassigned" all={all} onChange={setAll} />
            <SortControl<ItemsSorter>
              variants={itemsSortVariants}
              sorter={sorter}
              order={order}
              onChangeSorter={setSorter}
              onChangeOrder={setOrder}
            />
          </Group>
        </Stack>
        <Box>
          {visibleItems.map((item) => (
            <ItemSelectableCompactCard
              key={item.id}
              item={item}
              participant={item.participant}
              group={item.group}
              onClick={() => void 0}
              noCheckbox
            />
          ))}
        </Box>
      </Stack>
    </Box>
  );
});
