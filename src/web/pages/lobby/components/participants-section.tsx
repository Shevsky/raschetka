import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { UserCompactCard } from '~/web/components/cards/user-compact-card';
import { LabeledRow } from '~/web/components/rows/labeled-row';
import { LobbyContext } from '~/web/pages/lobby/lobby.context';

export const ParticipantsSection = observer(() => {
  const store = useContext(LobbyContext);

  const participants = store.lobby.participants!;

  return (
    <LabeledRow name="Участники" counter={participants.length}>
      {participants.map((participant) => (
        <UserCompactCard key={participant.id} user={participant.user!} />
      ))}
    </LabeledRow>
  );
});
