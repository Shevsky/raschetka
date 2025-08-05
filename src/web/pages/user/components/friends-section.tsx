import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { UserModel } from '~/persistence';
import { CollapsedAvatars } from '~/web/components/avatars/collapsed-avatars';
import { UserAvatar } from '~/web/components/avatars/user-avatar';
import { UserCompactCard } from '~/web/components/cards/user-compact-card';
import { LabeledRow } from '~/web/components/rows/labeled-row';
import { Page } from '~/web/config/pages.config';
import { UserContext } from '~/web/pages/user/user.context';

const max = 6;

export const FriendsSection = observer(() => {
  const navigate = useNavigate();
  const store = useContext(UserContext);

  const user = store.user;
  const friends = store.friends;

  const handleFriend = (friend: UserModel) => {
    navigate(generatePath(Page.USER, { id: friend.id }));
  };

  if (!friends.length) {
    return null;
  }

  return (
    <LabeledRow name="Друзья" counter={friends.length}>
      <CollapsedAvatars key={user.id} max={max}>
        {({ collapsed }) =>
          collapsed
            ? friends.map((friend) => <UserAvatar key={friend.id} user={friend} onClick={() => handleFriend(friend)} />)
            : friends.map((friend) => <UserCompactCard key={friend.id} user={friend} onClick={() => handleFriend(friend)} withChevron />)
        }
      </CollapsedAvatars>
    </LabeledRow>
  );
});
