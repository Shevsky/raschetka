import { generatePath, useNavigate } from 'react-router-dom';
import { CheckParticipantModel, Permission } from '~/persistence';
import { ParticipantCompactCard } from '~/web/components/cards/participant-compact-card';
import { hasPermission } from '~/web/config/auth.config';
import { Page } from '~/web/config/pages.config';

type TopSectionProps = {
  participant: CheckParticipantModel;
};

export const TopSection = ({ participant }: TopSectionProps) => {
  const navigate = useNavigate();

  const isInteractive = hasPermission(Permission.SEE_USERS);

  const handleClick = () => {
    navigate(generatePath(Page.USER, { id: participant.user!.id }));
  };

  return <ParticipantCompactCard participant={participant} withChevron={isInteractive} onClick={isInteractive ? handleClick : undefined} />;
};
