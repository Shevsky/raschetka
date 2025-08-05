import { css, cx } from '@emotion/css';
import { Avatar, DefaultMantineColor, MantineSize, Text } from '@mantine/core';
import { fontSize } from '~/web/utils/ui/font-size';

type EmojiAvatarProps = {
  emoji: string;
  color?: DefaultMantineColor;
  size?: MantineSize;
  grayscale?: boolean;
  onClick?(): void;
};

const styles = {
  grayscale: css({
    filter: 'grayscale(1)'
  })
};

export const EmojiAvatar = ({ emoji, color, size = 'md', grayscale, onClick }: EmojiAvatarProps) => {
  return (
    <Avatar
      className={cx(grayscale && styles.grayscale)}
      size={size}
      radius="100%"
      name={color ? undefined : emoji}
      color={color ?? 'initials'}
      onClick={onClick}
    >
      <Text fz={fontSize(size)}>{emoji}</Text>
    </Avatar>
  );
};
