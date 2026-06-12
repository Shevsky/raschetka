import { Stack } from '@mantine/core';
import { memo } from 'react';
import { ParticipantsSection } from '~/web/pages/lobby/components/participants-section';
import { QRSection } from '~/web/pages/lobby/components/qr-section';

export const MainSection = memo(() => {
  return (
    <Stack gap="lg">
      <QRSection />
      <ParticipantsSection />
    </Stack>
  );
});
