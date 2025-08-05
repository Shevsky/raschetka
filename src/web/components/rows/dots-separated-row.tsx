import { Group, Text } from '@mantine/core';
import { Children, Fragment, ReactNode } from 'react';

type DotsSeparatedRowProps = {
  children: ReactNode;
};

export const DotsSeparatedRow = ({ children }: DotsSeparatedRowProps) => {
  const childs = Children.toArray(children);

  return (
    <Group gap="xs">
      {childs.map((child, index) => (
        <Fragment key={index}>
          <div>{child}</div>
          {index !== childs.length - 1 && (
            <Text component="div" c="gray.7">
              •
            </Text>
          )}
        </Fragment>
      ))}
    </Group>
  );
};
