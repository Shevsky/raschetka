import { Avatar, MantineSize, Text } from '@mantine/core';
import { useMemo } from 'react';
import { CheckModel } from '~/persistence';
import { checkStatusesColors } from '~/utils/dicts/check-statuses.dict';
import { formatCheckInitials } from '~/utils/formatters/format-check';

type CheckAvatarProps = {
  check: CheckModel;
  size?: MantineSize;
  onClick?(): void;
};

export const CheckAvatar = ({ check, size = 'md', onClick }: CheckAvatarProps) => {
  const initials = useMemo(() => formatCheckInitials(check), [check]);

  return (
    <Avatar size={size} radius="100%" name={initials} color={checkStatusesColors[check.status]} onClick={onClick}>
      <Text>{initials}</Text>
    </Avatar>
  );
};
