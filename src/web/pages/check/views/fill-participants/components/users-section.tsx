import { Box, Group, Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useContext, useMemo, useState } from 'react';
import { getUsersFilterer } from '~/utils/business/filter-users';
import { getUsersComparer, UsersSorter, usersSortVariants } from '~/utils/business/sort-users';
import { ListViewControl } from '~/web/components/controls/list-view-control';
import { SearchControl } from '~/web/components/controls/search-control';
import { SortControl } from '~/web/components/controls/sort-control';
import { currentUser } from '~/web/config/auth.config';
import { CheckContext } from '~/web/pages/check/check.context';
import { UserSection } from '~/web/pages/check/views/fill-participants/components/user-section';

export const UsersSection = observer(() => {
  const store = useContext(CheckContext);

  const pickedUsers = store.pickedUsersAsParticipants.filter((user) => user.id !== currentUser.id);
  const selectableUsers = store.selectableAsParticipantsUsers;

  const [all, setAll] = useState(true);
  const [sorter, setSorter] = useState(UsersSorter.CREATED_AT);
  const [order, setOrder] = useState<Order>(1);
  const [query, setQuery] = useState('');

  const comparer = useMemo(() => getUsersComparer(sorter, order), [sorter, order]);
  const filterer = useMemo(() => getUsersFilterer(query), [query]);

  const visibleUsers = useMemo(
    () => (all ? selectableUsers.filter(filterer) : pickedUsers).toSorted(comparer),
    [pickedUsers, selectableUsers, all, filterer, comparer]
  );

  return (
    <Stack gap="lg">
      <Stack gap="md">
        <Group justify="space-between" wrap="nowrap">
          <ListViewControl type="selected" all={all} onChange={setAll} />
          <SortControl<UsersSorter>
            variants={usersSortVariants}
            sorter={sorter}
            order={order}
            onChangeSorter={setSorter}
            onChangeOrder={setOrder}
          />
        </Group>
        {all && <SearchControl value={query} onChange={setQuery} />}
      </Stack>
      <Box>
        {visibleUsers.map((user) => (
          <UserSection key={user.id} user={user} />
        ))}
      </Box>
    </Stack>
  );
});
