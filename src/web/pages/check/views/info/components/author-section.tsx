import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { Permission } from '~/persistence';
import { UserCompactCard } from '~/web/components/cards/user-compact-card';
import { LabeledRow } from '~/web/components/rows/labeled-row';
import { hasPermission } from '~/web/config/auth.config';
import { Page } from '~/web/config/pages.config';
import { CheckContext } from '~/web/pages/check/check.context';

export const AuthorSection = observer(() => {
  const navigate = useNavigate();
  const store = useContext(CheckContext);

  const isInteractive = hasPermission(Permission.SEE_USERS);

  const handleClick = () => {
    navigate(generatePath(Page.USER, { id: store.check.user!.id }));
  };

  return (
    <LabeledRow name="Создал">
      <UserCompactCard user={store.check.user!} withChevron={isInteractive} onClick={isInteractive ? handleClick : undefined} />
    </LabeledRow>
  );
});
