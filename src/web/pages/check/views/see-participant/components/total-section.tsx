import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { CheckParticipantModel } from '~/persistence';
import { ParticipantItemsSumCompactCard } from '~/web/components/cards/participant-items-sum-compact-card';
import { TipsSumCompactCard } from '~/web/components/cards/tips-sum-compact-card';
import { TotalSumCompactCard } from '~/web/components/cards/total-sum-compact-card';
import { LabeledRow } from '~/web/components/rows/labeled-row';
import { CheckContext } from '~/web/pages/check/check.context';
import { ItemGroupSection } from '~/web/pages/check/views/see-participant/components/item-group-section';

type TotalSectionProps = {
  participant: CheckParticipantModel;
};

export const TotalSection = observer(({ participant }: TotalSectionProps) => {
  const store = useContext(CheckContext);

  const tipsValues = store.tipsValues;
  const itemGroupsValues = store.itemGroupsValues;
  const itemsSum = store.participantsItemsSums.get(participant.id)!;
  const itemsCount = store.participantsItemsCounts.get(participant.id)!;
  const totalSum = store.participantsTotalSums.get(participant.id)!;

  return (
    <LabeledRow name="Итого">
      <ParticipantItemsSumCompactCard type="current" sum={itemsSum} count={itemsCount} />
      {participant.itemGroups!.map((itemGroup) => (
        <ItemGroupSection key={itemGroup.id} itemGroup={itemGroup} values={itemGroupsValues.get(itemGroup.id)!} />
      ))}
      {tipsValues && (
        <TipsSumCompactCard sum={tipsValues.sum} undividedSum={tipsValues.undividedSum} participantsCount={tipsValues.participantsCount} />
      )}
      <TotalSumCompactCard sum={totalSum} />
    </LabeledRow>
  );
});
