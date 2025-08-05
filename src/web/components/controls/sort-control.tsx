import { Group, NativeSelect, ThemeIcon } from '@mantine/core';
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';

type SortControlProps<Sorter extends string> = {
  variants: Record<Sorter, string>;
  sorter: Sorter;
  order: Order;
  onChangeSorter(sorter: Sorter): void;
  onChangeOrder(order: Order): void;
};

export const SortControl = <Sorter extends string>({
  variants,
  sorter,
  order,
  onChangeSorter,
  onChangeOrder
}: SortControlProps<Sorter>) => {
  return (
    <Group gap="xs" wrap="nowrap">
      <NativeSelect
        size="xs"
        data={Object.entries(variants).map(([value, label]) => ({ value, label: label as string }))}
        value={sorter}
        onChange={(event) => onChangeSorter(event.currentTarget.value as Sorter)}
      />
      <ThemeIcon color="gray" size="md" radius="sm" onClick={() => onChangeOrder(order === 1 ? -1 : 1)}>
        {order === 1 ? <IconSortDescending size={16} /> : <IconSortAscending size={16} />}
      </ThemeIcon>
    </Group>
  );
};
