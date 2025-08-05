import { Center, Container, Loader } from '@mantine/core';

export const LoadingLayout = () => {
  return (
    <Container h="100%" fluid>
      <Center h="100%">
        <Loader size="xl" />
      </Center>
    </Container>
  );
};
