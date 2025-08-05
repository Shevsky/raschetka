import { Text } from '@mantine/core';
import { CheckItemModel } from '~/persistence';
import { formatMoney } from '~/utils/formatters/format-money';
import { EmojiAvatar } from '~/web/components/avatars/emoji-avatar';
import { CompactCard } from '~/web/components/cards/compact-card';

type ItemCompactCardProps = {
  item: CheckItemModel;
  divideBy?: number;
  onClick?(): void;
};

export const ItemCompactCard = ({ item, divideBy, onClick }: ItemCompactCardProps) => {
  return (
    <CompactCard
      leftAccessory={<EmojiAvatar emoji={item.emoji} />}
      rightAccessory={
        <Text size="sm" fw={500}>
          {formatMoney(divideBy ? item.sum / divideBy : item.sum)}
        </Text>
      }
      onClick={onClick}
    >
      <Text size="sm" fw={500}>
        {item.name}
      </Text>
      <Text c="dimmed" size="xs">
        {item.quantity}&nbsp;×&nbsp;{formatMoney(item.price)}
        {!!divideBy && <>&nbsp;/&nbsp;{divideBy}</>}
      </Text>
    </CompactCard>
  );
};
