import { Avatar, MantineSize, Text } from '@mantine/core';
import { useMemo } from 'react';
import { UserModel } from '~/persistence';
import { formatUserEmoji } from '~/utils/formatters/format-user';
import { getStorageUrl } from '~/web/utils/misc/get-storage-url';
import { fontSize } from '~/web/utils/ui/font-size';

type UserAvatarProps = {
  user: UserModel;
  size?: MantineSize;
  onClick?(): void;
};

export const UserAvatar = ({ user, size = 'md', onClick }: UserAvatarProps) => {
  const accountWithUserpic = useMemo(() => user.accounts?.find((account) => !!account.userpic), [user]);

  if (accountWithUserpic) {
    return <Avatar size={size} src={getStorageUrl(accountWithUserpic.userpic!)} radius="100%" onClick={onClick} />;
  } else {
    return (
      <Avatar size={size} radius="100%" name={user.name} color="initials" onClick={onClick}>
        <Text fz={fontSize(size)}>{formatUserEmoji(user)}</Text>
      </Avatar>
    );
  }
};
