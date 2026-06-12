import { MantineSize } from '@mantine/core';
import { LobbyModel } from '~/persistence';
import { EmojiAvatar } from '~/web/components/avatars/emoji-avatar';

type LobbyAvatarProps = {
  lobby: LobbyModel;
  size?: MantineSize;
  onClick?(): void;
};

export const LobbyAvatar = ({ lobby, size = 'md', onClick }: LobbyAvatarProps) => {
  return <EmojiAvatar emoji={lobby.check ? '🤼' : '🤼‍♂️'} color="gray" size={size} onClick={onClick} />;
};
