import { NumberInput } from '@mantine/core';
import { IconCurrencyRubel } from '@tabler/icons-react';

type MoneyControlProps = {
  value: number;
  onChange(value: number): void;
};

export const MoneyControl = ({ value: rawValue, onChange }: MoneyControlProps) => {
  const value = rawValue / 100;

  const handleChange = (nextValue: string | number) => {
    onChange((Number(nextValue) || 0) * 100);
  };

  return (
    <NumberInput
      placeholder="0"
      rightSection={<IconCurrencyRubel size={16} />}
      thousandSeparator=" "
      min={0}
      value={value > 0 ? value : ''}
      onChange={handleChange}
      allowDecimal
      hideControls
    />
  );
};
