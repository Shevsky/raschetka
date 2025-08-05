import { $debug, backButton, init, initData, miniApp, themeParams, viewport } from '@telegram-apps/sdk-react';
import { RuntimeError } from '~/utils/errors/runtime.error';

export function configureSDK(): void {
  $debug.set(import.meta.env.DEV);

  init();

  if (!backButton.isSupported() || !miniApp.isSupported()) {
    throw new RuntimeError('Слишком старая версия Telegram');
  }

  backButton.mount();
  miniApp.mount();
  themeParams.mount();
  initData.restore();

  void viewport
    .mount()
    .catch((error) => {
      console.error('Что-то не так с монтированием viewport', error);
    })
    .then(() => {
      viewport.bindCssVars();
      viewport.expand.isAvailable() && viewport.expand();
    });

  miniApp.bindCssVars();
  themeParams.bindCssVars();
}
