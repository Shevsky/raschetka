import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { CheckModel } from '~/persistence';
import { CheckCompactCard } from '~/web/components/cards/check-compact-card';
import { LabeledRow } from '~/web/components/rows/labeled-row';
import { Page } from '~/web/config/pages.config';
import { UserContext } from '~/web/pages/user/user.context';

export const CreatedChecksSection = observer(() => {
  const navigate = useNavigate();
  const store = useContext(UserContext);

  const createdChecks = store.createdChecks;

  const handleCheck = (check: CheckModel) => {
    navigate(generatePath(Page.CHECK, { id: check.id }));
  };

  if (!createdChecks.length) {
    return null;
  }

  return (
    <LabeledRow name="Созданные чеки" counter={createdChecks.length}>
      {createdChecks.map((check) => (
        <CheckCompactCard key={check.id} check={check} onClick={() => handleCheck(check)} withChevron />
      ))}
    </LabeledRow>
  );
});
