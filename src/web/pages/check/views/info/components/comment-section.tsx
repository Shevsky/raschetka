import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { CheckCommentNotificationCard } from '~/web/components/cards/check-comment-notification-card';
import { CheckContext } from '~/web/pages/check/check.context';

export const CommentSection = observer(() => {
  const store = useContext(CheckContext);

  return <CheckCommentNotificationCard check={store.check} />;
});
