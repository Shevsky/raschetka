import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { CheckItemModel } from '~/persistence';
import { ItemSelectableCompactCard } from '~/web/components/cards/item-selectable-compact-card';
import { CheckContext } from '~/web/pages/check/check.context';

type ItemSectionProps = {
  item: CheckItemModel;
};

export const ItemSection = observer(({ item }: ItemSectionProps) => {
  const store = useContext(CheckContext);

  const selected = store.selfPickedItemIds.includes(item.id);
  const selfParticipant = store.selfParticipant;

  const handleClick = () => {
    store.handleToggleSelfPickedItem(item);
  };

  return (
    <ItemSelectableCompactCard
      item={item}
      participant={item.participant ?? (selected ? selfParticipant! : undefined)}
      selected={selected}
      disabled={!!item.participant && item.participant !== selfParticipant!}
      onClick={handleClick}
    />
  );
});
