import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { configureSuperjson } from '~/config/superjson.config';
import '~/polyfills';
import { ErrorLayout } from '~/web/components/layouts/error-layout';
import { authorize } from '~/web/config/auth.config';
import { configureBackButton } from '~/web/config/back-button.config';
import { configureMantine, MantineDevTool, mantineProviderProps } from '~/web/config/mantine.config';
import { configureMobX } from '~/web/config/mobx.config';
import { configureRouter, router } from '~/web/config/router.config';
import { routes } from '~/web/config/routes.config';
import { configureSDK } from '~/web/config/sdk.config';

const root = createRoot(document.getElementById('root')!);

async function main() {
  if (import.meta.env.DEV) {
    import('eruda').then((lib) => lib.default.init()).catch(console.error);
    // @ts-ignore
    await import('./mock-web-app');
  }

  configureSuperjson();

  configureSDK();
  configureMantine();
  configureMobX();

  await authorize();

  configureRouter(routes);
  configureBackButton();
}

try {
  await main();

  root.render(
    <MantineProvider {...mantineProviderProps}>
      {import.meta.env.DEV && <MantineDevTool />}
      <RouterProvider router={router} />
    </MantineProvider>
  );
} catch (error) {
  root.render(
    <MantineProvider {...mantineProviderProps}>
      <ErrorLayout error={error} onRetry={() => location.reload()} />
    </MantineProvider>
  );
}
