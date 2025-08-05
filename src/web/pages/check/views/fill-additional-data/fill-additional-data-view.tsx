import { Stack } from '@mantine/core';
import { CommentSection } from '~/web/pages/check/views/fill-additional-data/components/comment-section';
import { FooterSection } from '~/web/pages/check/views/fill-additional-data/components/footer-section';
import { NotificationSection } from '~/web/pages/check/views/fill-additional-data/components/notification-section';
import { TipsSection } from '~/web/pages/check/views/fill-additional-data/components/tips-section';
import { TitleSection } from '~/web/pages/check/views/fill-additional-data/components/title-section';

export const FillAdditionalDataView = () => {
  return (
    <Stack gap="lg">
      <NotificationSection />
      <TipsSection />
      <TitleSection />
      <CommentSection />
      <FooterSection />
    </Stack>
  );
};
