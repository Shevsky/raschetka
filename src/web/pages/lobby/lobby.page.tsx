import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { formatLobbyTitle } from '~/utils/formatters/format-lobby';
import { LobbyAvatar } from '~/web/components/avatars/lobby-avatar';
import { MainLayout } from '~/web/components/layouts/main-layout';
import { Page } from '~/web/config/pages.config';
import { MainSection } from '~/web/pages/lobby/components/main-section';
import { LobbyContext } from '~/web/pages/lobby/lobby.context';
import { LobbyStore } from '~/web/pages/lobby/lobby.store';
import { createLoader, LoaderArgs, withLoader } from '~/web/utils/router/loader';

type LobbyPageProps = {
  store: LobbyStore;
};

const LobbyPageInternal = observer(() => {
  const store = useContext(LobbyContext);

  return (
    <MainLayout icon={<LobbyAvatar lobby={store.lobby} />} title={formatLobbyTitle(store.lobby)}>
      <MainSection />
    </MainLayout>
  );
});

export const LobbyPage = withLoader<LobbyPageProps>(({ store }) => {
  return (
    <LobbyContext value={store}>
      <LobbyPageInternal />
    </LobbyContext>
  );
});

export const loadLobbyPage = createLoader<LobbyPageProps>(async (args: LoaderArgs<Page.LOBBY>) => {
  const id = args.params.id!;

  const store = await new LobbyStore(id).init();

  return { store };
});
