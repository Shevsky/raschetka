import { Button, Group } from '@mantine/core';
import { miniApp } from '@tma.js/sdk';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { CheckContext } from '~/web/pages/check/check.context';
import { processError } from '~/web/utils/behaviors/process-error';
import { useAsyncAction } from '~/web/utils/hooks/use-async-action';
import { mounted } from '~/web/utils/ui/mount-point';

export const FooterSection = mounted(
  'footer',
  observer(() => {
    const store = useContext(CheckContext);

    const [handleSubmit, isSubmitLoading] = useAsyncAction(store.handleSubmitFillCheck, {
      onSuccess: () => miniApp.close(),
      onError: processError
    });

    return (
      <Group align="center" justify="space-between" wrap="nowrap">
        <Button size="xs" color="blue" loading={isSubmitLoading} onClick={handleSubmit}>
          Подтвердить
        </Button>
      </Group>
    );
  })
);
