import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { CheckParticipantModel } from '~/persistence';
import { ParticipantCompactCard } from '~/web/components/cards/participant-compact-card';
import { LabeledRow } from '~/web/components/rows/labeled-row';
import { CheckContext } from '~/web/pages/check/check.context';
import { CheckViewType } from '~/web/pages/check/check.views';

export const ParticipantsSection = observer(() => {
  const store = useContext(CheckContext);

  const participants = store.check.participants!;

  const handleParticipant = (participant: CheckParticipantModel) => {
    store.handleView({
      type: CheckViewType.SEE_PARTICIPANT,
      payload: { id: participant.id }
    });
  };

  return (
    <LabeledRow name="Участники" counter={participants.length}>
      {participants.map((participant) => (
        <ParticipantCompactCard key={participant.id} participant={participant} onClick={() => handleParticipant(participant)} />
      ))}
    </LabeledRow>
  );
});
