import { Stack } from '@mantine/core';
import { FooterSection } from '~/web/pages/check/views/fill-item-groups/components/footer-section';
import { ItemsSection } from '~/web/pages/check/views/fill-item-groups/components/items-section';
import { NotificationSection } from '~/web/pages/check/views/fill-item-groups/components/notification-section';

export const FillItemGroupsView = () => {
  return (
    <Stack gap="lg">
      <NotificationSection />
      <ItemsSection />
      <FooterSection />
    </Stack>
  );
};
