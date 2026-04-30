import { Button, Group } from '@mantine/core';
import { miniApp, popup } from '@tma.js/sdk';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { CheckStatus } from '~/persistence';
import { formatMoney } from '~/utils/formatters/format-money';
import { formatPlural } from '~/utils/formatters/format-plural';
import { noop } from '~/utils/misc/noop';
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

    const [handleComplete, isCompleteLoading] = useAsyncAction(store.handleCompleteCheck, {
      onSuccess: () => miniApp.close(),
      onError: processError
    });

    const handleContinue = () => {
      popup
        .show({
          message: 'Точно закрыть чек?'.concat(
            selectableItems.length && selectableItems.length < check.items!.length
              ? ` ${formatPlural(selectableItems.length, 'Остался ещё {} не выбранный товар', 'Осталось ещё {} не выбранных товара', 'Осталось ещё {} не выбранных товаров')} на ${formatMoney(selectableItemsSum)}`
              : ''
          ),
          buttons: [
            {
              id: 'yes',
              type: 'destructive',
              text: 'Да, закрыть'
            },
            {
              type: 'cancel'
            }
          ]
        })
        .then((result) => {
          if (result === 'yes') {
            handleComplete();
          }
        })
        .catch(noop);
    };

    if (check.status !== CheckStatus.ACTIVE || !currentUserAuthor) {
      return null;
    }

    return (
      <Group align="center" justify="space-between" wrap="nowrap">
        <Button size="xs" color="blue" onClick={handleContinue} loading={isCompleteLoading}>
          Закрыть чек
        </Button>
      </Group>
    );
  })
);
