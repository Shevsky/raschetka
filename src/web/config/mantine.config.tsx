import { injectGlobal } from '@emotion/css';
import { ActionIcon, Box, MantineColorScheme, MantineProviderProps, useMantineColorScheme } from '@mantine/core';
import { IconSun } from '@tabler/icons-react';
import { themeParams } from '@telegram-apps/sdk-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { colorSchemeSelector } from '~/web/utils/ui/color-scheme-selector';

export const mantineProviderProps: MantineProviderProps = {};

export function configureMantine(): void {
  const isDark = themeParams.isDark();
  const textColor = themeParams.textColor();
  const backgroundColor = themeParams.backgroundColor();

  const defaultColorScheme: MantineColorScheme = isDark ? 'dark' : 'light';
  mantineProviderProps.defaultColorScheme = defaultColorScheme;

  injectGlobal({
    [`${colorSchemeSelector(defaultColorScheme)} body`]: {
      '--mantine-color-body': backgroundColor,
      '--mantine-color-text': textColor
    }
  });
}

export const MantineDevTool = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [portal, setPortal] = useState<HTMLDivElement>();

  useEffect(() => {
    const container = document.createElement('div');

    document.body.appendChild(container);
    setPortal(container);

    return () => container.remove();
  }, []);

  const handleToggleColorScheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  if (!portal) {
    return null;
  }

  return createPortal(
    <Box style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999 }}>
      <ActionIcon variant="filled" onClick={handleToggleColorScheme}>
        <IconSun stroke={1.5} />
      </ActionIcon>
    </Box>,
    portal
  );
};
