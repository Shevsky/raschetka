import { Box, Group, Text } from '@mantine/core';
import { CheckItemGroupModel, CheckItemModel, CheckParticipantModel } from '~/persistence';
import { formatMoney } from '~/utils/formatters/format-money';
import { EmojiAvatar } from '~/web/components/avatars/emoji-avatar';
import { UserAvatar } from '~/web/components/avatars/user-avatar';
import { CompactCard } from '~/web/components/cards/compact-card';
import { CheckboxControl } from '~/web/components/controls/checkbox-control';

type ItemSelectableCompactCardProps = {
  item: CheckItemModel;
  participant?: Nullish<CheckParticipantModel>;
  group?: Nullish<CheckItemGroupModel>;
  noCheckbox?: boolean;
  selected?: boolean;
  disabled?: boolean;
  onClick?(): void;
};

export const ItemSelectableCompactCard = ({
  item,
  participant,
  group,
  noCheckbox,
  selected,
  disabled,
  onClick
}: ItemSelectableCompactCardProps) => {
  const handleClick = () => {
    !disabled && onClick?.();
  };

  return (
    <CompactCard
      leftAccessory={<EmojiAvatar emoji={item.emoji} grayscale={disabled} />}
      rightAccessory={!noCheckbox && <CheckboxControl checked={selected} disabled={disabled} />}
      bottomAccessory={
        <Group justify="space-between" wrap="nowrap">
          <Text c={disabled ? 'dimmed' : undefined} size="sm" fw={500}>
            {formatMoney(item.sum)}
          </Text>
          {(participant || group) && (
            <Box mt={2}>
              {participant ? (
                <Group wrap="nowrap" align="center" gap="xs">
                  <UserAvatar user={participant.user!} size="xs" />
                  <Text size="xs">{participant.user!.name}</Text>
                </Group>
              ) : (
                <Box>
                  <Text size="xs">{group!.name}</Text>
                </Box>
              )}
            </Box>
          )}
        </Group>
      }
      highlighted={selected && !disabled}
      onClick={handleClick}
    >
      <Text c={disabled ? 'dimmed' : undefined} size="sm" fw={500}>
        {item.name}
      </Text>
      <Text c="dimmed" size="xs">
        {item.quantity}&nbsp;×&nbsp;{formatMoney(item.price)}
      </Text>
    </CompactCard>
  );
};
