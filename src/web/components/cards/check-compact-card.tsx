import { Text } from '@mantine/core';
import { CheckModel } from '~/persistence';
import { formatCheckTitle, formatCheckTotalSum, formatCheckTransactionAt } from '~/utils/formatters/format-check';
import { CheckAvatar } from '~/web/components/avatars/check-avatar';
import { CompactCard } from '~/web/components/cards/compact-card';
import { DotsSeparatedRow } from '~/web/components/rows/dots-separated-row';

type CheckCompactCardProps = {
  check: CheckModel;
  withChevron?: boolean;
  onClick?(): void;
};

export const CheckCompactCard = ({ check, withChevron, onClick }: CheckCompactCardProps) => {
  return (
    <CompactCard leftAccessory={<CheckAvatar check={check} />} withChevron={withChevron} onClick={onClick}>
      <Text size="sm" fw={500}>
        {formatCheckTitle(check)}
      </Text>
      <Text component="div" c="dimmed" size="xs" mt={2}>
        <DotsSeparatedRow>
          <Text>{formatCheckTransactionAt(check, true)}</Text>
          <Text>{formatCheckTotalSum(check)}</Text>
        </DotsSeparatedRow>
      </Text>
    </CompactCard>
  );
};
