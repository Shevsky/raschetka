import { css } from '@emotion/css';
import { AppShell, Box, Group, MantineSpacing, Title, Transition } from '@mantine/core';
import { retrieveLaunchParams } from '@tma.js/sdk';
import { ReactNode, useMemo, useRef } from 'react';
import { LayoutSpacingContext } from '~/web/contexts/layout.context';
import { ScrollableContext } from '~/web/contexts/scrollable.context';
import { useMountedAtPoint } from '~/web/utils/ui/mount-point';

type MainLayoutProps = {
  children: ReactNode;
  icon?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
};

const spacing: MantineSpacing = 'sm';

const headerHeight = 50;
const footerHeight = 50;

const iosBottomPadding = 25;

const styles = {
  widthBoundary: css({
    maxWidth: '100%'
  }),
  overflowHidden: css({
    overflow: 'hidden'
  }),
  title: css({
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  })
};

export const MainLayout = ({ children, icon, title, subtitle }: MainLayoutProps) => {
  const lp = useMemo(() => retrieveLaunchParams(), []);
  const scrollableRef = useRef<HTMLDivElement>(null);

  const alert = useMountedAtPoint('alert');
  const footer = useMountedAtPoint('footer');

  const bottomPadding = lp.tgWebAppPlatform === 'ios' ? iosBottomPadding : 0;

  return (
    <AppShell header={{ height: headerHeight }} footer={{ height: footer ? footerHeight + bottomPadding : bottomPadding }} h="100%">
      {title && (
        <AppShell.Header pl={spacing} pr={spacing}>
          <Box w="100%" h="100%" display="flex">
            <Group className={styles.widthBoundary} gap="sm" wrap="nowrap">
              {icon}
              <Box className={styles.overflowHidden} flex="1">
                <Title className={styles.title} order={1} size="md">
                  {title}
                </Title>
                {subtitle && (
                  <Title order={2} c="dimmed" size="xs" fw={400}>
                    {subtitle}
                  </Title>
                )}
              </Box>
            </Group>
          </Box>
        </AppShell.Header>
      )}
      <AppShell.Main bgr="inherit" h="100%" style={{ position: 'relative' }}>
        <Transition mounted={!!alert} transition="fade-down" timingFunction="ease">
          {(style) => (
            <Box w="100%" p={spacing} style={{ ...style, position: 'absolute', left: 0, right: 0, zIndex: 9 }}>
              {alert}
            </Box>
          )}
        </Transition>

        <LayoutSpacingContext value={spacing}>
          <ScrollableContext value={scrollableRef}>
            <Box ref={scrollableRef} p={spacing} style={{ overflowY: 'auto' }} h="100%">
              {children}
            </Box>
          </ScrollableContext>
        </LayoutSpacingContext>
      </AppShell.Main>
      {footer && (
        <AppShell.Footer pl={spacing} pr={spacing}>
          <Box w="100%" display="flex" style={{ height: `${footerHeight}px` }}>
            <Box w="100%" style={{ alignSelf: 'center' }}>
              {footer}
            </Box>
          </Box>
        </AppShell.Footer>
      )}
    </AppShell>
  );
};
