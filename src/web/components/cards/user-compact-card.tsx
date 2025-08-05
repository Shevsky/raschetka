import { Text } from '@mantine/core';
import { ReactNode } from 'react';
import { UserModel } from '~/persistence';
import { UserAvatar } from '~/web/components/avatars/user-avatar';
import { CompactCard } from '~/web/components/cards/compact-card';

type UserCompactCardProps = {
  user: UserModel;
  rightAccessory?: ReactNode;
  withChevron?: boolean;
  highlighted?: boolean;
  onClick?(): void;
};

export const UserCompactCard = ({ user, rightAccessory, withChevron, highlighted, onClick }: UserCompactCardProps) => {
  return (
    <CompactCard
      leftAccessory={<UserAvatar user={user} />}
      rightAccessory={rightAccessory}
      withChevron={withChevron}
      highlighted={highlighted}
      onClick={onClick}
    >
      <Text size="sm" fw={500}>
        {user.name}
      </Text>
      {!!user.mention && (
        <Text c="dimmed" size="xs">
          {user.mention}
        </Text>
      )}
    </CompactCard>
  );
};
