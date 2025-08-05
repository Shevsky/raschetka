import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { UserModel } from '~/persistence';
import { UserCompactCard } from '~/web/components/cards/user-compact-card';
import { LabeledRow } from '~/web/components/rows/labeled-row';
import { Page } from '~/web/config/pages.config';
import { UserContext } from '~/web/pages/user/user.context';

export const InviterSection = observer(() => {
  const navigate = useNavigate();
  const store = useContext(UserContext);

  const user = store.user;

  const handleInviter = (inviter: UserModel) => {
    navigate(generatePath(Page.USER, { id: inviter.id }));
  };

  if (!user.inviter) {
    return null;
  }

  return (
    <LabeledRow name="Кто пригласил?">
      <UserCompactCard user={user.inviter} onClick={() => handleInviter(user.inviter!)} withChevron />
    </LabeledRow>
  );
});
