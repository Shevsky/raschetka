import { css } from '@emotion/css';
import { Chip, Group } from '@mantine/core';
import { match } from 'ts-pattern';

type ListViewControlType = 'selected' | 'unassigned';

type ListViewControlProps = {
  type: ListViewControlType;
  all: boolean;
  onChange(all: boolean): void;
};

const styles = {
  chipsNoIcon: css({
    ['& .mantine-Chip-label']: {
      padding: 'var(--chip-checked-padding)'
    },
    ['& .mantine-Chip-iconWrapper']: {
      display: 'none'
    }
  })
};

export const ListViewControl = ({ type, all, onChange }: ListViewControlProps) => {
  return (
    <Group className={styles.chipsNoIcon} gap="xs" wrap="nowrap">
      <Chip size="xs" checked={all} onClick={() => onChange(true)}>
        Все
      </Chip>
      <Chip size="xs" checked={!all} onClick={() => onChange(false)}>
        {match(type)
          .with('selected', () => 'Выбранные')
          .with('unassigned', () => 'Неназначенные')
          .exhaustive()}
      </Chip>
    </Group>
  );
};
