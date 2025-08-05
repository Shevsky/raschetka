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

  const selected = store.specifiedCommonItemGroupItemIds.includes(item.id);

  const handleClick = () => {
    store.handleToggleSpecifiedCommonItemGroupItem(item);
  };

  return <ItemSelectableCompactCard item={item} selected={selected} onClick={handleClick} />;
});
