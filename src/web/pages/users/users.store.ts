import { mutex } from 'decorio';
import { action, observable, runInAction } from 'mobx';
import { UserModel } from '~/persistence';
import { trpc } from '~/web/config/trpc.config';

const take = 20;

export class UsersStore {
  /** Список пользователей */
  @observable accessor users: Array<UserModel> = [];
  /** Происходит дозагрузка списка */
  @observable accessor loading: boolean = false;
  /** Список полностью загружен и дозагрузка отключена */
  @observable accessor disabled: boolean = false;

  /** Инициализация */
  @mutex async init(): Promise<this> {
    const users = await trpc.user.getLatestUsers.query({ take, skip: 0 });

    this.users = users;
    this.disabled = users.length < take;

    return this;
  }

  /** Загрузить следующую страницу */
  @action @mutex handleLoadNextPage = async (): Promise<void> => {
    this.loading = true;

    try {
      const nextUsers = await trpc.user.getLatestUsers.query({ take, skip: this.users.length });

      runInAction(() => {
        this.users = [...this.users, ...nextUsers];
        this.disabled = nextUsers.length < take;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
