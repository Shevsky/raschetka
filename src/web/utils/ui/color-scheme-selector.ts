import { MantineColorScheme } from '@mantine/core';

export function colorSchemeSelector(colorScheme: MantineColorScheme): string {
  return `[data-mantine-color-scheme="${colorScheme}"]`;
}
