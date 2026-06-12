import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { LobbyContext } from '~/web/pages/lobby/lobby.context';

export const QRSection = observer(() => {
  const store = useContext(LobbyContext);

  const id = store.lobby.id;

  return (
    <div>
      <img src={`/api/http/lobby/qr/${id}`} />
    </div>
  );
});
