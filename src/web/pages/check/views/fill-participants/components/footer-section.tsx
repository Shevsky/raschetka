import { Button, Group, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { formatPlural } from '~/utils/formatters/format-plural';
import { CheckContext } from '~/web/pages/check/check.context';
import { CheckViewType } from '~/web/pages/check/check.views';
import { mounted } from '~/web/utils/ui/mount-point';

export const FooterSection = mounted(
  'footer',
  observer(() => {
    const store = useContext(CheckContext);

    const usersCount = store.pickedUserIdsAsParticipants.length;
    const currentUserPicked = store.currentUserPickedAsParticipant;

    const handleContinue = () => {
      store.handleView({
        type: CheckViewType.FILL_ITEM_GROUPS
      });
    };

    return (
      <Group align="center" justify="space-between" wrap="nowrap">
        <Button size="xs" color="blue" disabled={usersCount <= 1} onClick={handleContinue}>
          Продолжить
        </Button>
        {usersCount > 0 && (
          <Text size="xs" ta="right">
            <Text component="span">{usersCount}</Text>
            &nbsp;
            <Text c="dimmed" component="span">
              {formatPlural(usersCount, 'человек', 'человека', 'человек')}
            </Text>
            {currentUserPicked && <Text component="span">, включая себя</Text>}
          </Text>
        )}
      </Group>
    );
  })
);
