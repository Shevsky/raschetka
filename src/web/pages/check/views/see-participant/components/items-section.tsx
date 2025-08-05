import { Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { CheckParticipantModel } from '~/persistence';
import { formatMoney } from '~/utils/formatters/format-money';
import { ActionCompactCard } from '~/web/components/cards/action-compact-card';
import { ItemCompactCard } from '~/web/components/cards/item-compact-card';
import { LabeledRow } from '~/web/components/rows/labeled-row';
import { currentUser } from '~/web/config/auth.config';
import { CheckContext } from '~/web/pages/check/check.context';
import { CheckViewType } from '~/web/pages/check/check.views';

type ItemsSectionProps = {
  participant: CheckParticipantModel;
};

export const ItemsSection = observer(({ participant }: ItemsSectionProps) => {
  const store = useContext(CheckContext);

  const isSelfParticipant = participant.userId === currentUser.id;
  const selectableItems = store.selectableItems;
  const itemsSum = store.participantsItemsSums.get(participant.id)!;

  const handleAdd = () => {
    store.handleView({
      type: CheckViewType.PICK_ITEMS
    });
  };

  return (
    <LabeledRow name="Выбранные товары" description={participant.filled && formatMoney(itemsSum)}>
      {isSelfParticipant && selectableItems.length > 0 && (
        <ActionCompactCard type="add" onClick={handleAdd}>
          Добавить товары
        </ActionCompactCard>
      )}
      {participant.filled ? (
        participant.items!.map((item) => <ItemCompactCard key={item.id} item={item} />)
      ) : (
        <Text c="dimmed">&mdash;</Text>
      )}
    </LabeledRow>
  );
});
