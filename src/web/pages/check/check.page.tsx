import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import { formatCheckTitle, formatCheckTransactionAt } from '~/utils/formatters/format-check';
import { CheckAvatar } from '~/web/components/avatars/check-avatar';
import { MainLayout } from '~/web/components/layouts/main-layout';
import { Page } from '~/web/config/pages.config';
import { CheckContext } from '~/web/pages/check/check.context';
import { CheckStore } from '~/web/pages/check/check.store';
import { MainSection } from '~/web/pages/check/components/main-section';
import { createLoader, LoaderArgs, withLoader } from '~/web/utils/router/loader';

type CheckPageProps = {
  store: CheckStore;
};

const CheckPageInternal = observer(() => {
  const store = useContext(CheckContext);

  return (
    <MainLayout
      icon={<CheckAvatar check={store.check} />}
      title={formatCheckTitle(store.check)}
      subtitle={formatCheckTransactionAt(store.check, true)}
    >
      <MainSection />
    </MainLayout>
  );
});

export const CheckPage = withLoader<CheckPageProps>(({ store }) => {
  useEffect(() => {
    return () => store.cleanup();
  }, [store]);

  return (
    <CheckContext value={store}>
      <CheckPageInternal />
    </CheckContext>
  );
});

export const loadCheckPage = createLoader<CheckPageProps>(async (args: LoaderArgs<Page.CHECK>) => {
  const id = args.params.id!;

  const store = await new CheckStore(id).init();

  return { store };
});
