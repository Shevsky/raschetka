import { Stack } from '@mantine/core';
import { ItemsSection } from '~/web/pages/check/views/items/components/items-section';
import { TopSection } from '~/web/pages/check/views/items/components/top-section';

export const ItemsView = () => {
  return (
    <Stack gap="lg">
      <TopSection />
      <ItemsSection />
    </Stack>
  );
};
