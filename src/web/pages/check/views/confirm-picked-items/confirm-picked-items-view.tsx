import { Stack } from '@mantine/core';
import { FooterSection } from '~/web/pages/check/views/confirm-picked-items/components/footer-section';
import { NotificationSection } from '~/web/pages/check/views/confirm-picked-items/components/notification-section';
import { PickedItemsSection } from '~/web/pages/check/views/confirm-picked-items/components/picked-items-section';
import { TotalSection } from '~/web/pages/check/views/confirm-picked-items/components/total-section';

export const ConfirmPickedItemsView = () => {
  return (
    <Stack gap="lg">
      <NotificationSection />
      <TotalSection />
      <PickedItemsSection />
      <FooterSection />
    </Stack>
  );
};
