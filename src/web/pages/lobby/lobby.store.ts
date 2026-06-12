import { mutex } from 'decorio';
import { observable } from 'mobx';
import { LobbyModel } from '~/persistence';
import { trpc } from '~/web/config/trpc.config';

export class LobbyStore {
  readonly #id: string;

  /** Активная комната */
  @observable accessor lobby!: LobbyModel;

  constructor(id: string) {
    this.#id = id;
  }

  /** Инициализация */
  @mutex async init(): Promise<this> {
    this.lobby = await trpc.lobby.getLobby.query({ id: this.#id });

    return this;
  }
}
