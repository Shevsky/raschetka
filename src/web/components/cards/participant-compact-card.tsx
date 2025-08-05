import { IconCheck, IconX } from '@tabler/icons-react';
import { CheckParticipantModel } from '~/persistence';
import { UserCompactCard } from '~/web/components/cards/user-compact-card';
import { variables } from '~/web/utils/ui/variables';

type ParticipantCompactCardProps = {
  participant: CheckParticipantModel;
  withChevron?: boolean;
  onClick?(): void;
};

export const ParticipantCompactCard = ({ participant, withChevron, onClick }: ParticipantCompactCardProps) => {
  return (
    <UserCompactCard
      user={participant.user!}
      rightAccessory={
        participant.filled ? <IconCheck color={variables.colors.green6} size={22} /> : <IconX color={variables.colors.gray6} size={22} />
      }
      withChevron={withChevron}
      onClick={onClick}
    />
  );
};
