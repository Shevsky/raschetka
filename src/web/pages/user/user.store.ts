import { mutex, singleflight } from 'decorio';
import { action, observable, runInAction } from 'mobx';
import { CheckModel, Permission, UserModel } from '~/persistence';
import { toggle } from '~/utils/misc/toggle';
import { currentUser, hasPermission } from '~/web/config/auth.config';
import { trpc } from '~/web/config/trpc.config';

export class UserStore {
  readonly #id: string;

  /** Сущность пользователя */
  @observable accessor user!: UserModel;
  /** Его друзья */
  @observable accessor friends!: Array<UserModel>;
  /** Созданные им чеки */
  @observable accessor createdChecks!: Array<CheckModel>;
  /** Назначенные на него чеки */
  @observable accessor assignedChecks!: Array<CheckModel>;

  constructor(id: string) {
    this.#id = id;
  }

  /** Инициализация */
  @mutex async init(): Promise<this> {
    const takeChecks = hasPermission(Permission.SEE_CHECKS) || this.#id === currentUser.id;

    [this.user, this.friends, this.createdChecks, this.assignedChecks] = await Promise.all([
      trpc.user.getUser.query({ id: this.#id }),
      trpc.user.getUserFriends.query({ id: this.#id }),
      takeChecks ? trpc.check.getCreatedChecks.query({ userId: this.#id }) : Promise.resolve([]),
      takeChecks ? trpc.check.getAssignedChecks.query({ userId: this.#id }) : Promise.resolve([])
    ]);

    return this;
  }

  /** Включить или отключить пермишен */
  @action @singleflight handleTogglePermission = async (permission: Permission): Promise<void> => {
    const given = await trpc.user.toggleUserPermission.mutate({ id: this.#id, permission });

    runInAction(() => {
      this.user.permissions = toggle(this.user.permissions, permission, { state: given });
    });
  };
}
