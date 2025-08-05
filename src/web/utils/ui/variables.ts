import { MantineFontSize, MantineSpacing } from '@mantine/core';
import { identityProxy } from '~/utils/misc/identity-proxy';
import { ColorResolver, createColorResolver } from '~/web/utils/ui/color-resolver';

type VariablesProxy = {
  spacings: Record<MantineSpacing, string>;
  fz: Record<MantineFontSize, string>;
  colors: ColorResolver;
};

// https://mantine.dev/styles/css-variables-list/
export const variables: VariablesProxy = {
  spacings: identityProxy((key) => `var(--mantine-spacing-${key})`) as Record<MantineSpacing, string>,
  fz: identityProxy((key) => `var(--mantine-font-size-${key})`) as Record<MantineSpacing, string>,
  colors: createColorResolver((color, variant) => `var(--mantine-color-${color}-${variant})`)
};
