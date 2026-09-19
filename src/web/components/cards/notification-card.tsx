import { css } from '@emotion/css';
import { DefaultMantineColor, Notification } from '@mantine/core';
import { ReactNode, SyntheticEvent, useState } from 'react';

type NotificationCardProps = {
  children: ReactNode;
  color?: DefaultMantineColor;
  withClose?: boolean;
  onClick?(event: SyntheticEvent): void;
};

const styles = {
  // @ts-ignore
  allowSelect: css({
    userSelect: 'text !important',
    '-webkit-user-select': 'text !important',
    '-webkit-touch-callout': 'default !important'
  })
};

export const NotificationCard = ({ children, color, withClose = false, onClick }: NotificationCardProps) => {
  const [isClosed, setClosed] = useState(false);

  if (isClosed) {
    return null;
  }

  return (
    <Notification
      className={styles.allowSelect}
      color={color}
      lh="xs"
      onClick={onClick}
      onClose={withClose ? () => setClosed(true) : undefined}
      withCloseButton={withClose}
    >
      {children}
    </Notification>
  );
};
