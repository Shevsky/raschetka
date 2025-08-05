import { Center, Loader } from '@mantine/core';
import { memo } from 'react';

export const LoadingCard = memo(() => {
  return (
    <Center p="md">
      <Loader size="sm" />
    </Center>
  );
});
