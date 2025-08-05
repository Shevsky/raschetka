/* eslint-disable @typescript-eslint/no-magic-numbers */

import { MantineSize } from '@mantine/core';

export function fontSize(size: MantineSize): number | string {
  switch (size) {
    case 'xs': {
      return 12;
    }
    case 'sm': {
      return 16;
    }
    case 'md': {
      return 24;
    }
    case 'lg': {
      return 36;
    }
    case 'xl': {
      return 54;
    }
    default: {
      return size;
    }
  }
}
