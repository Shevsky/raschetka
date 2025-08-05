import { Text } from '@mantine/core';
import { formatMoney } from '~/utils/formatters/format-money';
import { EmojiAvatar } from '~/web/components/avatars/emoji-avatar';
import { CompactCard } from '~/web/components/cards/compact-card';

type TotalSumCompactCardProps = {
  sum: number;
};

export const TotalSumCompactCard = ({ sum }: TotalSumCompactCardProps) => {
  return (
    <CompactCard
      leftAccessory={<EmojiAvatar emoji="🫰" color="green" />}
      rightAccessory={
        <Text size="sm" fw={500}>
          {formatMoney(sum)}
        </Text>
      }
    >
      <Text size="sm" fw={500}>
        Общая сумма
      </Text>
    </CompactCard>
  );
};
