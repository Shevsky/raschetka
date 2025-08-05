import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { CheckModel } from '~/persistence';
import { CheckCompactCard } from '~/web/components/cards/check-compact-card';
import { LabeledRow } from '~/web/components/rows/labeled-row';
import { Page } from '~/web/config/pages.config';
import { UserContext } from '~/web/pages/user/user.context';

export const AssignedChecksSection = observer(() => {
  const navigate = useNavigate();
  const store = useContext(UserContext);

  const assignedChecks = store.assignedChecks;

  const handleCheck = (check: CheckModel) => {
    navigate(generatePath(Page.CHECK, { id: check.id }));
  };

  if (!assignedChecks.length) {
    return null;
  }

  return (
    <LabeledRow name="Назначенные чеки" counter={assignedChecks.length}>
      {assignedChecks.map((check) => (
        <CheckCompactCard key={check.id} check={check} onClick={() => handleCheck(check)} withChevron />
      ))}
    </LabeledRow>
  );
});
