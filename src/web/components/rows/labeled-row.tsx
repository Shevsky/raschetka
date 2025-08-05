import { Box, Group, Text } from '@mantine/core';
import { ReactNode } from 'react';

type LabeledRowProps = {
  name: string;
  counter?: number;
  description?: ReactNode;
  note?: ReactNode;
  children: ReactNode;
};

export const LabeledRow = ({ name, counter, description, note, children }: LabeledRowProps) => {
  return (
    <Box>
      <Group>
        <Box flex="1">
          <Text c="dimmed" size="sm" fw={700}>
            {name}
            {!!counter && (
              <Text component="span" fw={400}>
                {' '}
                {counter}
              </Text>
            )}
          </Text>
        </Box>
        {description && (
          <Text c="dimmed" size="sm" fw={500}>
            {description}
          </Text>
        )}
      </Group>
      <Text component="div" size="sm" mt={4}>
        {children}
      </Text>
      {note && (
        <Text c="dimmed" size="xs" mt={4}>
          {note}
        </Text>
      )}
    </Box>
  );
};
