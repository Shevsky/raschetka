import { Button, Center, Container, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconAlertTriangleFilled } from '@tabler/icons-react';
import { useMemo } from 'react';
import { describeError } from '~/web/utils/behaviors/describe-error';

type ErrorLayoutProps = {
  error: unknown;
  onRetry?(): void;
};

export const ErrorLayout = ({ error, onRetry }: ErrorLayoutProps) => {
  const [title, subtitle, stack] = useMemo(() => describeError(error), [error]);

  return (
    <Container h="100%" fluid>
      <Center h="100%">
        <Stack align="center" gap="md">
          <ThemeIcon color="red" size="xl" radius="xl">
            <IconAlertTriangleFilled />
          </ThemeIcon>
          <Title order={2}>{title}</Title>
          <Text c="dimmed" ta="center" style={{ whiteSpace: 'pre-line' }}>
            {subtitle}
          </Text>
          {stack && (
            <Text c="dimmed" ta="center" style={{ whiteSpace: 'pre-line' }}>
              {stack.join('\n')}
            </Text>
          )}
          <Button onClick={onRetry} variant="light" size="xs" color="red">
            Попробовать ещё
          </Button>
        </Stack>
      </Center>
    </Container>
  );
};
