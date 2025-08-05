import { Text } from '@mantine/core';
import { formatMoney } from '~/utils/formatters/format-money';
import { formatPlural } from '~/utils/formatters/format-plural';
import { EmojiAvatar } from '~/web/components/avatars/emoji-avatar';
import { CompactCard } from '~/web/components/cards/compact-card';

type ItemsSumCompactCardProps = {
  sum: number;
  count: number;
  withChevron?: boolean;
  onClick?(): void;
};

export const ItemsSumCompactCard = ({ sum, count, withChevron, onClick }: ItemsSumCompactCardProps) => {
  return (
    <CompactCard
      leftAccessory={<EmojiAvatar emoji="💵" color="gray" />}
      rightAccessory={
        <Text size="sm" fw={500}>
          {formatMoney(sum)}
        </Text>
      }
      withChevron={withChevron}
      onClick={onClick}
    >
      <Text size="sm" fw={500}>
        Товары по чеку
      </Text>
      <Text c="dimmed" size="xs">
        {formatPlural(count, '{} товар', '{} товара', '{} товаров')}
      </Text>
    </CompactCard>
  );
};
