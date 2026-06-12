import { createContext } from 'react';
import { LobbyStore } from '~/web/pages/lobby/lobby.store';

export const LobbyContext = createContext<LobbyStore>(null!);
