import { Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { CheckContext } from '~/web/pages/check/check.context';
import { ItemsSection } from '~/web/pages/check/views/see-participant/components/items-section';
import { TopSection } from '~/web/pages/check/views/see-participant/components/top-section';
import { TotalSection } from '~/web/pages/check/views/see-participant/components/total-section';

type SeeParticipantViewProps = {
  id: string;
};

export const SeeParticipantView = observer(({ id }: SeeParticipantViewProps) => {
  const store = useContext(CheckContext);

  const participant = store.participants.get(id)!;

  return (
    <Stack gap="lg">
      <TopSection participant={participant} />
      <TotalSection participant={participant} />
      <ItemsSection participant={participant} />
    </Stack>
  );
});
