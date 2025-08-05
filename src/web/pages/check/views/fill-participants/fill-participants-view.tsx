import { Stack } from '@mantine/core';
import { CurrentUserSection } from '~/web/pages/check/views/fill-participants/components/current-user-section';
import { FooterSection } from '~/web/pages/check/views/fill-participants/components/footer-section';
import { NotificationSection } from '~/web/pages/check/views/fill-participants/components/notification-section';
import { UsersSection } from '~/web/pages/check/views/fill-participants/components/users-section';

export const FillParticipantsView = () => {
  return (
    <Stack gap="lg">
      <NotificationSection />
      <CurrentUserSection />
      <UsersSection />
      <FooterSection />
    </Stack>
  );
};
