import { TextInput } from '@mantine/core';
import { IconCircleXFilled, IconSearch } from '@tabler/icons-react';
import { ChangeEvent, useRef } from 'react';

type SearchControlProps = {
  value: string;
  onChange(value: string): void;
};

export const SearchControl = ({ value, onChange }: SearchControlProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    onChange('');
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.currentTarget.value);
  };

  return (
    <TextInput
      ref={inputRef}
      leftSection={<IconSearch size={16} />}
      rightSection={value.length > 0 ? <IconCircleXFilled size={24} onClick={handleReset} /> : undefined}
      placeholder="Поиск"
      size="sm"
      w="100%"
      value={value}
      onChange={handleChange}
    />
  );
};
