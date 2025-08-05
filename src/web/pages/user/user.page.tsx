import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { UserAvatar } from '~/web/components/avatars/user-avatar';
import { MainLayout } from '~/web/components/layouts/main-layout';
import { Page } from '~/web/config/pages.config';
import { MainSection } from '~/web/pages/user/components/main-section';
import { UserContext } from '~/web/pages/user/user.context';
import { UserStore } from '~/web/pages/user/user.store';
import { createLoader, LoaderArgs, withLoader } from '~/web/utils/router/loader';

type UserPageProps = {
  store: UserStore;
};

const UserPageInternal = observer(() => {
  const store = useContext(UserContext);

  const user = store.user;

  return (
    <MainLayout icon={<UserAvatar user={user} />} title={user.name}>
      <MainSection />
    </MainLayout>
  );
});

export const UserPage = withLoader<UserPageProps>(({ store }) => {
  return (
    <UserContext value={store}>
      <UserPageInternal />
    </UserContext>
  );
});

export const loadUserPage = createLoader<UserPageProps>(async (args: LoaderArgs<Page.USER>) => {
  const id = args.params.id!;

  const store = await new UserStore(id).init();

  return { store };
});
