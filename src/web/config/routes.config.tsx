import { RouteObject, useRouteError } from 'react-router-dom';
import { ErrorLayout } from '~/web/components/layouts/error-layout';
import { Page } from '~/web/config/pages.config';
import { CheckPage, loadCheckPage } from '~/web/pages/check';
import { loadLobbyPage, LobbyPage } from '~/web/pages/lobby';
import { RootPage } from '~/web/pages/root';
import { loadUserPage, UserPage } from '~/web/pages/user';
import { loadUsersPage, UsersPage } from '~/web/pages/users';
import { shouldRevalidate } from '~/web/utils/router/should-revalidate';

export const routes: Array<RouteObject> = [
  {
    path: '/',
    element: <RootPage />,
    ErrorBoundary: () => <ErrorLayout error={useRouteError()} onRetry={() => location.reload()} />,
    children: [
      { path: Page.USERS, element: <UsersPage />, loader: loadUsersPage, shouldRevalidate, hasErrorBoundary: true },
      { path: Page.USER, element: <UserPage />, loader: loadUserPage, shouldRevalidate },
      { path: Page.CHECK, element: <CheckPage />, loader: loadCheckPage, shouldRevalidate },
      { path: Page.LOBBY, element: <LobbyPage />, loader: loadLobbyPage, shouldRevalidate }
    ]
  }
];
