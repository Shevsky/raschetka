import { Text } from '@mantine/core';
import { formatMoney } from '~/utils/formatters/format-money';
import { EmojiAvatar } from '~/web/components/avatars/emoji-avatar';
import { CompactCard } from '~/web/components/cards/compact-card';

type TipsSumCompactCardProps = {
  sum: number;
  undividedSum?: number;
  participantsCount?: number;
};

export const TipsSumCompactCard = ({ sum, undividedSum, participantsCount }: TipsSumCompactCardProps) => {
  return (
    <CompactCard
      leftAccessory={<EmojiAvatar emoji="☕️" color="gray" />}
      rightAccessory={
        <Text size="sm" fw={500}>
          {formatMoney(sum)}
        </Text>
      }
    >
      <Text size="sm" fw={500}>
        Чаевые
      </Text>
      {!!undividedSum && !!participantsCount && (
        <Text c="dimmed" size="xs">
          {formatMoney(undividedSum)}&nbsp;/&nbsp;{participantsCount}
        </Text>
      )}
    </CompactCard>
  );
};
