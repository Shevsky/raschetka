import { Checkbox, useMantineColorScheme } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { variables } from '~/web/utils/ui/variables';

type CheckboxIndicatorProps = {
  checked?: boolean;
  disabled?: boolean;
};

export const CheckboxControl = ({ checked, disabled }: CheckboxIndicatorProps) => {
  const { colorScheme } = useMantineColorScheme();

  if (disabled) {
    return (
      <Checkbox.Indicator
        style={{ borderColor: colorScheme === 'dark' ? variables.colors.dark4 : undefined }}
        icon={IconX}
        checked
        disabled
      />
    );
  } else {
    return <Checkbox.Indicator checked={checked} />;
  }
};
