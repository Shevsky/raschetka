import { Avatar, Text } from '@mantine/core';
import { IconPencil, IconPlus } from '@tabler/icons-react';
import { ReactNode } from 'react';
import { match } from 'ts-pattern';
import { CompactCard } from '~/web/components/cards/compact-card';

type ActionCompactCardType = 'add' | 'edit';

type ActionCompactCardProps = {
  type: ActionCompactCardType;
  children: ReactNode;
  onClick?(): void;
};

export const ActionCompactCard = ({ type, children, onClick }: ActionCompactCardProps) => {
  return (
    <CompactCard
      leftAccessory={
        <Avatar size="md" color="indigo">
          {match(type)
            .with('add', () => <IconPlus />)
            .with('edit', () => <IconPencil />)
            .exhaustive()}
        </Avatar>
      }
      onClick={onClick}
    >
      <Text size="sm" fw={500}>
        {children}
      </Text>
    </CompactCard>
  );
};
