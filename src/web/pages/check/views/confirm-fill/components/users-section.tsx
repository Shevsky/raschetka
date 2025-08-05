import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { UserCompactCard } from '~/web/components/cards/user-compact-card';
import { LabeledRow } from '~/web/components/rows/labeled-row';
import { CheckContext } from '~/web/pages/check/check.context';

export const UsersSection = observer(() => {
  const store = useContext(CheckContext);

  const users = store.pickedUsersAsParticipants;

  return (
    <LabeledRow name="Участники" counter={users.length}>
      {users.map((user) => (
        <UserCompactCard key={user.id} user={user} />
      ))}
    </LabeledRow>
  );
});
