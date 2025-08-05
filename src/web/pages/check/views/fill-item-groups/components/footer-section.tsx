import { Box, Button, Group, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { formatMoney } from '~/utils/formatters/format-money';
import { formatPlural } from '~/utils/formatters/format-plural';
import { CheckContext } from '~/web/pages/check/check.context';
import { CheckViewType } from '~/web/pages/check/check.views';
import { mounted } from '~/web/utils/ui/mount-point';

export const FooterSection = mounted(
  'footer',
  observer(() => {
    const store = useContext(CheckContext);

    const itemsCount = store.specifiedCommonItemGroupItemIds.length;
    const itemsSum = store.specifiedCommonItemGroupItemsSum;

    const handleContinue = () => {
      store.handleView({
        type: CheckViewType.FILL_ADDITIONAL_DATA
      });
    };

    return (
      <Group align="center" justify="space-between" wrap="nowrap">
        <Button size="xs" color="blue" onClick={handleContinue}>
          Продолжить
        </Button>
        {itemsCount > 0 && (
          <Box>
            <Text size="xs" ta="right">
              <Text component="span">{itemsCount}</Text>
              &nbsp;
              <Text c="dimmed" component="span">
                {formatPlural(itemsCount, 'общая позиция', 'общих позиции', 'общих позиций')}
              </Text>
            </Text>
            <Text size="xs" mt={2} ta="right">
              <Text c="dimmed" component="span">
                На
              </Text>
              &nbsp;
              <Text component="span">{formatMoney(itemsSum)}</Text>
            </Text>
          </Box>
        )}
      </Group>
    );
  })
);
