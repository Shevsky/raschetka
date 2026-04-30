import { Group, Tabs } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { EmojiAvatar } from '~/web/components/avatars/emoji-avatar';
import { UserAvatar } from '~/web/components/avatars/user-avatar';
import { currentUser } from '~/web/config/auth.config';
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
          <Tabs.Tab value="self">
            <Group gap="xs" wrap="nowrap" align="center" justify="center">
              <UserAvatar user={currentUser} size="sm" />
              Моё
            </Group>
          </Tabs.Tab>
          <Tabs.Tab value="check">
            <Group gap="xs" wrap="nowrap" align="center" justify="center">
              <EmojiAvatar emoji="🧾" color="gray" size="sm" />
              По чеку
            </Group>
          </Tabs.Tab>
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
