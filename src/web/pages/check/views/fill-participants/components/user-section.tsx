import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { UserModel } from '~/persistence';
import { UserSelectableCompactCard } from '~/web/components/cards/user-selectable-compact-card';
import { CheckContext } from '~/web/pages/check/check.context';

type UserSectionProps = {
  user: UserModel;
};

export const UserSection = observer(({ user }: UserSectionProps) => {
  const store = useContext(CheckContext);

  const selected = store.pickedUserIdsAsParticipants.includes(user.id);

  const handleClick = () => {
    store.handleTogglePickedUserAsParticipant(user);
  };

  return <UserSelectableCompactCard user={user} selected={selected} onClick={handleClick} />;
});
