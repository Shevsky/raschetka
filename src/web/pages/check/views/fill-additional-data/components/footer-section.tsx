import { Button, Group } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { CheckContext } from '~/web/pages/check/check.context';
import { CheckViewType } from '~/web/pages/check/check.views';
import { mounted } from '~/web/utils/ui/mount-point';

export const FooterSection = mounted(
  'footer',
  observer(() => {
    const store = useContext(CheckContext);

    const handleContinue = () => {
      store.handleView({
        type: CheckViewType.CONFIRM_FILL
      });
    };

    return (
      <Group align="center" justify="space-between" wrap="nowrap">
        <Button size="xs" color="blue" onClick={handleContinue}>
          Продолжить
        </Button>
      </Group>
    );
  })
);
