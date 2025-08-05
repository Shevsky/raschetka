import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { UserModel } from '~/persistence';
import { LoadingCard } from '~/web/components/cards/loading-card';
import { UserCompactCard } from '~/web/components/cards/user-compact-card';
import { InfiniteScroll } from '~/web/components/misc/infinite-scroll';
import { Page } from '~/web/config/pages.config';
import { UsersContext } from '~/web/pages/users/users.context';
import { processError } from '~/web/utils/behaviors/process-error';

export const MainSection = observer(() => {
  const navigate = useNavigate();
  const store = useContext(UsersContext);

  const disabled = store.disabled;

  const handleUser = (user: UserModel) => {
    navigate(generatePath(Page.USER, { id: user.id }));
  };

  const handleLoad = store.handleLoadNextPage;

  return (
    <InfiniteScroll fallback={<LoadingCard />} disabled={disabled} onLoad={handleLoad} onError={processError}>
      {store.users.map((user) => (
        <UserCompactCard key={user.id} user={user} onClick={() => handleUser(user)} withChevron />
      ))}
    </InfiniteScroll>
  );
});
