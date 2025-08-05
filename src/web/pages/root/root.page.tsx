import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { LoadingLayout } from '~/web/components/layouts/loading-layout';

export const RootPage = () => {
  return (
    <Suspense fallback={<LoadingLayout />}>
      <Outlet />
    </Suspense>
  );
};
