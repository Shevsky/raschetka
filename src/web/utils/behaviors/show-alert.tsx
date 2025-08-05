import { Alert, Group } from '@mantine/core';
import { IconAlertTriangleFilled, IconCircleCheckFilled } from '@tabler/icons-react';
import { match } from 'ts-pattern';
import { chill } from '~/utils/misc/chill';
import { isMountedAtPoint, mountAtPoint, unmountAtPoint } from '~/web/utils/ui/mount-point';

type AlertType = 'success' | 'error' | 'warning';

const unmountAfterMs = 5_000;
const ifMountedDelayMs = 300;

export function showAlert(type: AlertType, title: string, subtitle: string): void {
  function mount(): void {
    const unmount = mountAtPoint(
      'alert',
      <Alert
        variant="filled"
        color={match(type)
          .with('error', () => 'red')
          .with('success', () => 'green')
          .with('warning', () => 'yellow')
          .exhaustive()}
        title={
          <Group gap="xs" wrap="nowrap">
            {match(type)
              .with('error', () => <IconAlertTriangleFilled />)
              .with('success', () => <IconCircleCheckFilled />)
              .with('warning', () => <IconAlertTriangleFilled />)
              .exhaustive()}
            {title}
          </Group>
        }
        onClose={() => unmountAtPoint('alert')}
        withCloseButton
      >
        {subtitle}
      </Alert>
    );

    void chill(unmountAfterMs).then(unmount);
  }

  if (isMountedAtPoint('alert')) {
    unmountAtPoint('alert');

    void chill(ifMountedDelayMs).then(mount);
  } else {
    mount();
  }
}
