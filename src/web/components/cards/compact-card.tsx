import { css } from '@emotion/css';
import { Box, Group, MantineSpacing, UnstyledButton, useMantineColorScheme } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { ReactNode, useContext } from 'react';
import { LayoutSpacingContext } from '~/web/contexts/layout.context';
import { variables } from '~/web/utils/ui/variables';

type CompactCardProps = {
  children: ReactNode;
  leftAccessory?: ReactNode;
  rightAccessory?: ReactNode;
  bottomAccessory?: ReactNode;
  withChevron?: boolean;
  highlighted?: boolean;
  onClick?(): void;
};

const styles = {
  turnSpacing: (spacing: MantineSpacing) =>
    css({
      marginLeft: `calc(-1 * ${variables.spacings[spacing]})`,
      marginRight: `calc(-1 * ${variables.spacings[spacing]})`,
      paddingLeft: variables.spacings[spacing],
      paddingRight: variables.spacings[spacing]
    })
};

export const CompactCard = ({
  children,
  leftAccessory,
  rightAccessory,
  bottomAccessory,
  withChevron,
  highlighted,
  onClick
}: CompactCardProps) => {
  const { colorScheme } = useMantineColorScheme();
  const spacing = useContext(LayoutSpacingContext);

  return (
    <Box
      className={styles.turnSpacing(spacing)}
      style={{
        backgroundColor: highlighted ? (colorScheme === 'dark' ? variables.colors.blueLight : variables.colors.blue0) : 'transparent'
      }}
    >
      <UnstyledButton w="100%" onClick={onClick}>
        <Box pt="xs" pb="xs">
          <Group gap="xs" wrap="nowrap">
            {leftAccessory && <Box flex="0 0">{leftAccessory}</Box>}
            <Box flex="1">
              <Group gap="xs" wrap="nowrap">
                <Box flex="1">{children}</Box>
                {withChevron && (
                  <Box flex="0 0">
                    <IconChevronRight size={14} stroke={1.5} />
                  </Box>
                )}
                {rightAccessory && <Box flex="0 0">{rightAccessory}</Box>}
              </Group>
              {bottomAccessory && <Box mt={2}>{bottomAccessory}</Box>}
            </Box>
          </Group>
        </Box>
      </UnstyledButton>
    </Box>
  );
};
