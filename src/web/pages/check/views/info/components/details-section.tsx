import { Tabs } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { CheckContext } from '~/web/pages/check/check.context';
import { CheckDetailsSection } from '~/web/pages/check/views/info/components/check-details-section';
import { SelfDetailsSection } from '~/web/pages/check/views/info/components/self-details-section';

export const DetailsSection = observer(() => {
  const store = useContext(CheckContext);

  const selfParticipant = store.selfParticipant;

  if (selfParticipant?.filled) {
    return (
      <Tabs variant="outline" defaultValue="self">
        <Tabs.List mb="sm" grow>
          <Tabs.Tab value="self">Моё</Tabs.Tab>
          <Tabs.Tab value="check">По чеку</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="self">
          <SelfDetailsSection />
        </Tabs.Panel>
        <Tabs.Panel value="check">
          <CheckDetailsSection />
        </Tabs.Panel>
      </Tabs>
    );
  } else {
    return <CheckDetailsSection />;
  }
});
