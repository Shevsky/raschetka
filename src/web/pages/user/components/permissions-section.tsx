import { Box, Group, Stack, Switch, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Permission } from '~/persistence';
import { permissionsTitles } from '~/utils/dicts/permissions.dict';
import { LabeledRow } from '~/web/components/rows/labeled-row';
import { hasPermission } from '~/web/config/auth.config';
import { UserContext } from '~/web/pages/user/user.context';
import { processError } from '~/web/utils/behaviors/process-error';

export const PermissionsSection = observer(() => {
  const store = useContext(UserContext);

  const user = store.user;

  const handleToggle = (permission: Permission) => {
    store.handleTogglePermission(permission).catch(processError);
  };

  if (!hasPermission(Permission.EDIT_USERS)) {
    return null;
  }

  return (
    <LabeledRow name="Права">
      <Stack gap="sm">
        {Object.values(Permission).map((permission) => (
          <Group key={permission} align="center" justify="space-between" wrap="nowrap">
            <Box>
              <Text size="sm">{permissionsTitles[permission]}</Text>
              <Text c="dimmed" size="xs">
                {permission}
              </Text>
            </Box>
            <Switch size="md" checked={user.permissions.includes(permission)} onChange={() => handleToggle(permission)} />
          </Group>
        ))}
      </Stack>
    </LabeledRow>
  );
});
