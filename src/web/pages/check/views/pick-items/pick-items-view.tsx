import { Stack } from '@mantine/core';
import { FooterSection } from '~/web/pages/check/views/pick-items/components/footer-section';
import { ItemsSection } from '~/web/pages/check/views/pick-items/components/items-section';
import { NotificationSection } from '~/web/pages/check/views/pick-items/components/notification-section';

export const PickItemsView = () => {
  return (
    <Stack gap="lg">
      <NotificationSection />
      <ItemsSection />
      <FooterSection />
    </Stack>
  );
};
