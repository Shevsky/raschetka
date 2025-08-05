import { Stack } from '@mantine/core';
import { AuthorSection } from '~/web/pages/check/views/info/components/author-section';
import { CommentSection } from '~/web/pages/check/views/info/components/comment-section';
import { DetailsSection } from '~/web/pages/check/views/info/components/details-section';
import { ParticipantsSection } from '~/web/pages/check/views/info/components/participants-section';

export const InfoView = () => {
  return (
    <Stack gap="lg">
      <CommentSection />
      <DetailsSection />
      <AuthorSection />
      <ParticipantsSection />
    </Stack>
  );
};
