import { Button, Group, Modal, Text } from '@mantine/core';
import { miniApp } from '@tma.js/sdk';
import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
import { CheckStatus } from '~/persistence';
import { formatMoney } from '~/utils/formatters/format-money';
import { formatPlural } from '~/utils/formatters/format-plural';
import { CheckContext } from '~/web/pages/check/check.context';
import { processError } from '~/web/utils/behaviors/process-error';
import { useAsyncAction } from '~/web/utils/hooks/use-async-action';
import { mounted } from '~/web/utils/ui/mount-point';

export const FooterSection = mounted(
  'footer',
  observer(() => {
    const store = useContext(CheckContext);

    const check = store.check;
    const currentUserAuthor = store.currentUserAuthor;
    const selectableItems = store.selectableItems;
    const selectableItemsSum = store.selectableItemsSum;

    const [isCompleteModalOpen, setCompleteModalOpen] = useState(false);

    const [handleComplete, isCompleteLoading] = useAsyncAction(store.handleCompleteCheck, {
      onSuccess: () => miniApp.close(),
      onError: processError
    });

    const handleContinue = () => {
      setCompleteModalOpen(true);
    };

    const handleCloseCompleteModal = () => {
      setCompleteModalOpen(false);
    };

    if (check.status !== CheckStatus.ACTIVE || !currentUserAuthor) {
      return null;
    }

    return (
      <>
        <Modal opened={isCompleteModalOpen} onClose={handleCloseCompleteModal} centered>
          <Text>
            Точно закрыть чек?
            {selectableItems.length && selectableItems.length < check.items!.length
              ? ` ${formatPlural(selectableItems.length, 'Остался ещё {} невыбранный товар', 'Осталось ещё {} невыбранных товара', 'Осталось ещё {} невыбранных товаров')} на ${formatMoney(selectableItemsSum)}`
              : ''}
          </Text>

          <Group mt="xl" justify="space-between" wrap="nowrap">
            <Button variant="light" onClick={handleCloseCompleteModal} fullWidth>
              Отмена
            </Button>
            <Button color="red" onClick={handleComplete} loading={isCompleteLoading} fullWidth>
              Да, закрыть
            </Button>
          </Group>
        </Modal>

        <Group align="center" justify="space-between" wrap="nowrap">
          <Button size="xs" color="blue" onClick={handleContinue} loading={isCompleteLoading}>
            Закрыть чек
          </Button>
        </Group>
      </>
    );
  })
);
