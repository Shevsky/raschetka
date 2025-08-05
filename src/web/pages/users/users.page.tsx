import { IconUsers } from '@tabler/icons-react';
import { MainLayout } from '~/web/components/layouts/main-layout';
import { MainSection } from '~/web/pages/users/components/main-section';
import { UsersContext } from '~/web/pages/users/users.context';
import { UsersStore } from '~/web/pages/users/users.store';
import { createLoader, withLoader } from '~/web/utils/router/loader';

type UsersPageProps = {
  store: UsersStore;
};

const UsersPageInternal = () => {
  return (
    <MainLayout icon={<IconUsers />} title="Пользователи">
      <MainSection />
    </MainLayout>
  );
};

export const UsersPage = withLoader<UsersPageProps>(({ store }) => {
  return (
    <UsersContext value={store}>
      <UsersPageInternal />
    </UsersContext>
  );
});

export const loadUsersPage = createLoader<UsersPageProps>(async () => {
  const store = await new UsersStore().init();

  return { store };
});
