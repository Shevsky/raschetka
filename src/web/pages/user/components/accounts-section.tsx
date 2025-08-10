import { Anchor, Box, Group, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { getExternalAccountInfo } from '~/utils/business/get-external-account-info';
import { LabeledRow } from '~/web/components/rows/labeled-row';
import { UserContext } from '~/web/pages/user/user.context';

export const AccountsSection = observer(() => {
  const store = useContext(UserContext);

  const user = store.user;
  const accounts = user.accounts!.map(getExternalAccountInfo);

  return (
    <LabeledRow name="Аккаунты">
      <Stack gap="xs">
        {accounts.map((account) => (
          <Group key={account.raw.provider} align="flex-start" justify="space-between">
            <Box flex="1">
              <Anchor href={account.url} size="sm">
                {account.mention ?? user.name}
              </Anchor>
              <Text c="dimmed" size="xs">
                {account.raw.provider}
              </Text>
            </Box>
            <Box flex="0 0">{account.raw.providerId}</Box>
          </Group>
        ))}
      </Stack>
    </LabeledRow>
  );
});
