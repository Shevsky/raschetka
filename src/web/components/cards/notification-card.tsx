import { DefaultMantineColor, Notification } from '@mantine/core';
import { ReactNode, useState } from 'react';

type NotificationCardProps = {
  children: ReactNode;
  color?: DefaultMantineColor;
  withClose?: boolean;
};

export const NotificationCard = ({ children, color, withClose = false }: NotificationCardProps) => {
  const [isClosed, setClosed] = useState(false);

  if (isClosed) {
    return null;
  }

  return (
    <Notification color={color} lh="xs" onClose={withClose ? () => setClosed(true) : undefined} withCloseButton={withClose}>
      {children}
    </Notification>
  );
};
