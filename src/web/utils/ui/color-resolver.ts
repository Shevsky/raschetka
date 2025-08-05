import { DefaultMantineColor } from '@mantine/core';

export type ColorResolver = {
  [K in `${DefaultMantineColor}${'0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'Light' | 'Filled' | 'Outline'}`]: string;
};

export function createColorResolver(resolve: (color: DefaultMantineColor, variant: string) => string): ColorResolver {
  return new Proxy<ColorResolver>({} as unknown as ColorResolver, {
    get(_, property) {
      const [, color, variant] = /^([a-z]+)(\d+|[A-Z][a-z]+)$/.exec(String(property))!;

      return resolve(color, variant.toLowerCase());
    }
  });
}
