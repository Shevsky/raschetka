import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { UserSelectableCompactCard } from '~/web/components/cards/user-selectable-compact-card';
import { currentUser } from '~/web/config/auth.config';
import { CheckContext } from '~/web/pages/check/check.context';

export const CurrentUserSection = observer(() => {
  const store = useContext(CheckContext);

  const selected = store.currentUserPickedAsParticipant;

  const handleClick = store.handleTogglePickedCurrentUserAsParticipant;

  return <UserSelectableCompactCard user={currentUser} selected={selected} onClick={handleClick} />;
});
