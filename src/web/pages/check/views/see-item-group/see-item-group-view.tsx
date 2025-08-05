import { Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { CheckContext } from '~/web/pages/check/check.context';
import { ItemGroupSection } from '~/web/pages/check/views/see-item-group/components/item-group-section';
import { TopSection } from '~/web/pages/check/views/see-item-group/components/top-section';

type SeeItemGroupViewProps = {
  id: string;
};

export const SeeItemGroupView = observer(({ id }: SeeItemGroupViewProps) => {
  const store = useContext(CheckContext);

  const itemGroup = store.itemGroups.get(id)!;
  const values = store.itemGroupsValues.get(id)!;

  return (
    <Stack gap="lg">
      <TopSection itemGroup={itemGroup} values={values} />
      <ItemGroupSection itemGroup={itemGroup} values={values} />
    </Stack>
  );
});
