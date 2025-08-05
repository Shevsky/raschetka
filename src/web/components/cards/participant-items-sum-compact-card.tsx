import { Text } from '@mantine/core';
import { match } from 'ts-pattern';
import { formatMoney } from '~/utils/formatters/format-money';
import { formatPlural } from '~/utils/formatters/format-plural';
import { EmojiAvatar } from '~/web/components/avatars/emoji-avatar';
import { CompactCard } from '~/web/components/cards/compact-card';

type ParticipantItemsSumCompactCardType = 'current' | 'prev';

type ParticipantItemsSumCompactCardProps = {
  type: ParticipantItemsSumCompactCardType;
  sum: number;
  count: number;
  withChevron?: boolean;
  onClick?(): void;
};

export const ParticipantItemsSumCompactCard = ({ type, sum, count, withChevron, onClick }: ParticipantItemsSumCompactCardProps) => {
  return (
    <CompactCard
      leftAccessory={<EmojiAvatar emoji="🧺" color="gray" />}
      rightAccessory={
        <Text size="sm" fw={500}>
          {formatMoney(sum)}
        </Text>
      }
      withChevron={withChevron}
      onClick={onClick}
    >
      <Text size="sm" fw={500}>
        {match(type)
          .with('current', () => 'Выбранные товары')
          .with('prev', () => 'Ранее выбранные товары')
          .exhaustive()}
      </Text>
      <Text c="dimmed" size="xs">
        {formatPlural(count, '{} товар', '{} товара', '{} товаров')}
      </Text>
    </CompactCard>
  );
};
