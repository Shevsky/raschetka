import { backButton } from '@telegram-apps/sdk-react';
import { router } from '~/web/config/router.config';

export function configureBackButton(): void {
  let unsubscribe: Nullish<VoidFunction> = null;
  function handleStateChanged(canGoBack: boolean): void {
    unsubscribe?.();
    unsubscribe = null;

    if (canGoBack) {
      backButton.show();
      unsubscribe = backButton.onClick(() => void router.navigate(-1));
    } else {
      backButton.hide();
    }
  }

  let latestCanGoBack: Nullish<boolean> = null;

  router.subscribe(() => {
    const canGoBack = Boolean(window.history.state && window.history.state.idx > 0);

    if (latestCanGoBack === null) {
      latestCanGoBack = canGoBack;
    } else {
      if (latestCanGoBack === canGoBack) {
        return;
      }

      latestCanGoBack = canGoBack;
    }

    handleStateChanged(canGoBack);
  });
}
