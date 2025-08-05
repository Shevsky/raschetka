import { Box, Group, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useContext, useMemo, useState } from 'react';
import { getItemsFilterer } from '~/utils/business/filter-items';
import { getItemsComparer, ItemsSorter, itemsSortVariants } from '~/utils/business/sort-items';
import { ListViewControl } from '~/web/components/controls/list-view-control';
import { SearchControl } from '~/web/components/controls/search-control';
import { SortControl } from '~/web/components/controls/sort-control';
import { CheckContext } from '~/web/pages/check/check.context';
import { ItemSection } from '~/web/pages/check/views/fill-item-groups/components/item-section';

export const ItemsSection = observer(() => {
  const store = useContext(CheckContext);

  const specifiedItems = store.specifiedCommonItemGroupItems;
  const selectableItems = store.check.items!;

  const [all, setAll] = useState(true);
  const [sorter, setSorter] = useState(ItemsSorter.INDEX);
  const [order, setOrder] = useState<Order>(1);
  const [query, setQuery] = useState('');

  const comparer = useMemo(() => getItemsComparer(sorter, order), [sorter, order]);
  const filterer = useMemo(() => getItemsFilterer(query), [query]);

  const visibleItems = useMemo(
    () => (all ? selectableItems.filter(filterer) : specifiedItems).toSorted(comparer),
    [specifiedItems, selectableItems, all, filterer, comparer]
  );

  return (
    <Stack gap="lg">
      <Stack gap="md">
        <Group justify="space-between" wrap="nowrap">
          <ListViewControl type="selected" all={all} onChange={setAll} />
          <SortControl<ItemsSorter>
            variants={itemsSortVariants}
            sorter={sorter}
            order={order}
            onChangeSorter={setSorter}
            onChangeOrder={setOrder}
          />
        </Group>
        {all && <SearchControl value={query} onChange={setQuery} />}
      </Stack>
      <Box>
        {visibleItems.map((item) => (
          <ItemSection key={item.id} item={item} />
        ))}
      </Box>
    </Stack>
  );
});
