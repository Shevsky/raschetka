import { Box } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { ParticipantItemsSumCompactCard } from '~/web/components/cards/participant-items-sum-compact-card';
import { TipsSumCompactCard } from '~/web/components/cards/tips-sum-compact-card';
import { TotalSumCompactCard } from '~/web/components/cards/total-sum-compact-card';
import { CheckContext } from '~/web/pages/check/check.context';
import { CheckViewType } from '~/web/pages/check/check.views';
import { ItemGroupSection } from '~/web/pages/check/views/info/components/item-group-section';

export const SelfDetailsSection = observer(() => {
  const store = useContext(CheckContext);

  const selfParticipant = store.selfParticipant!;
  const tipsValues = store.tipsValues;
  const itemGroupsValues = store.itemGroupsValues;
  const itemsSum = store.participantsItemsSums.get(selfParticipant.id)!;
  const itemsCount = store.participantsItemsCounts.get(selfParticipant.id)!;
  const totalSum = store.participantsTotalSums.get(selfParticipant.id)!;

  const handleSeeItems = () => {
    store.handleView({
      type: CheckViewType.SEE_PARTICIPANT,
      payload: { id: selfParticipant.id }
    });
  };

  return (
    <Box>
      <ParticipantItemsSumCompactCard type="current" sum={itemsSum} count={itemsCount} onClick={handleSeeItems} withChevron />
      {selfParticipant.itemGroups!.map((itemGroup) => (
        <ItemGroupSection key={itemGroup.id} itemGroup={itemGroup} values={itemGroupsValues.get(itemGroup.id)!} />
      ))}
      {tipsValues && (
        <TipsSumCompactCard sum={tipsValues.sum} undividedSum={tipsValues.undividedSum} participantsCount={tipsValues.participantsCount} />
      )}
      <TotalSumCompactCard sum={totalSum} />
    </Box>
  );
});
