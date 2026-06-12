import { LobbyModel } from '~/persistence';
import { formatLocaleDate } from '~/utils/formatters/format-locale-date';

export function formatLobbyTitle(lobby: LobbyModel): string {
  return `Комната от ${formatLocaleDate(lobby.createdAt)}`;
}
