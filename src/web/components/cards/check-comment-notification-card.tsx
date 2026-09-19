import { SyntheticEvent } from 'react';
import { CheckModel } from '~/persistence';
import { doneReactions } from '~/utils/dicts/reactions.dict';
import { formatCheckComment } from '~/utils/formatters/format-check';
import { choice } from '~/utils/misc/choice';
import { noop } from '~/utils/misc/noop';
import { NotificationCard } from '~/web/components/cards/notification-card';
import { showAlert } from '~/web/utils/behaviors/show-alert';
import { copyToClipboard } from '~/web/utils/misc/copy-to-clipboard';

type CheckCommentNotificationCardProps = {
  check: CheckModel;
};

export const CheckCommentNotificationCard = ({ check }: CheckCommentNotificationCardProps) => {
  if (!check.comment) {
    return null;
  }

  const handleClick = (event: SyntheticEvent) => {
    if (event.target instanceof HTMLAnchorElement && event.target.href.startsWith('tel:')) {
      event.preventDefault();

      const phoneNumber = event.target.href.slice('tel:'.length);

      copyToClipboard(phoneNumber)
        .then(() => showAlert('success', choice(doneReactions), 'Номер скопирован'))
        .catch(noop);
    }
  };

  return (
    <NotificationCard color="green" onClick={handleClick}>
      <span dangerouslySetInnerHTML={{ __html: formatCheckComment(check) }} />
    </NotificationCard>
  );
};
