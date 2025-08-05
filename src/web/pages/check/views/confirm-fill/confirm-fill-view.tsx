import { Stack } from '@mantine/core';
import { CommonItemGroupSection } from '~/web/pages/check/views/confirm-fill/components/common-item-group-section';
import { FooterSection } from '~/web/pages/check/views/confirm-fill/components/footer-section';
import { NotGroupedItemsSection } from '~/web/pages/check/views/confirm-fill/components/not-grouped-items-section';
import { NotificationSection } from '~/web/pages/check/views/confirm-fill/components/notification-section';
import { TotalSection } from '~/web/pages/check/views/confirm-fill/components/total-section';
import { UsersSection } from '~/web/pages/check/views/confirm-fill/components/users-section';

export const ConfirmFillView = () => {
  return (
    <Stack gap="lg">
      <NotificationSection />
      <TotalSection />
      <UsersSection />
      <CommonItemGroupSection />
      <NotGroupedItemsSection />
      <FooterSection />
    </Stack>
  );
};
