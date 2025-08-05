import { Text } from '@mantine/core';
import { CheckItemGroupModel } from '~/persistence';
import { formatMoney } from '~/utils/formatters/format-money';
import { mostFrequent } from '~/utils/misc/most-frequent';
import { EmojiAvatar } from '~/web/components/avatars/emoji-avatar';
import { CompactCard } from '~/web/components/cards/compact-card';

type ItemGroupSumCompactCardProps = {
  itemGroup: CheckItemGroupModel;
  sum: number;
  undividedSum?: number;
  participantsCount?: number;
  withChevron?: boolean;
  onClick?(): void;
};

export const ItemGroupSumCompactCard = ({
  itemGroup,
  sum,
  undividedSum,
  participantsCount,
  withChevron,
  onClick
}: ItemGroupSumCompactCardProps) => {
  const emoji = mostFrequent(itemGroup.items!.map((item) => item.emoji))!;

  return (
    <CompactCard
      leftAccessory={<EmojiAvatar emoji={emoji} color="gray" />}
      rightAccessory={
        <Text size="sm" fw={500}>
          {formatMoney(sum)}
        </Text>
      }
      withChevron={withChevron}
      onClick={onClick}
    >
      <Text size="sm" fw={500}>
        {itemGroup.name}
      </Text>
      {!!undividedSum && !!participantsCount && (
        <Text c="dimmed" size="xs">
          {formatMoney(undividedSum)}&nbsp;/&nbsp;{participantsCount}
        </Text>
      )}
    </CompactCard>
  );
};
