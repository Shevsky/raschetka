import { CheckModel } from '~/persistence';
import { formatCheckComment } from '~/utils/formatters/format-check';
import { NotificationCard } from '~/web/components/cards/notification-card';

type CheckCommentNotificationCardProps = {
  check: CheckModel;
};

export const CheckCommentNotificationCard = ({ check }: CheckCommentNotificationCardProps) => {
  return (
    <NotificationCard color="green">
      <span dangerouslySetInnerHTML={{ __html: formatCheckComment(check) }} />
    </NotificationCard>
  );
};
