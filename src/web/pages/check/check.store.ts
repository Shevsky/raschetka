import { mutex } from 'decorio';
import { action, computed, observable, runInAction } from 'mobx';
import { Subscription } from 'rxjs';
import { CheckItemGroupModel, CheckItemModel, CheckModel, CheckParticipantModel, CheckStatus, LobbyModel, UserModel } from '~/persistence';
import { CalculatedItemGroupValues, calculateItemGroupValues } from '~/utils/business/calculate-item-group-values';
import { calculateParticipantItemsSum } from '~/utils/business/calculate-participant-items-sum';
import { CalculatedTipsValues, calculateTipsValues } from '~/utils/business/calculate-tips-values';
import { InvalidArgumentError } from '~/utils/errors/invalid-argument.error';
import { formatPlural } from '~/utils/formatters/format-plural';
import { exhaustiveCheck } from '~/utils/misc/exhaustive-check';
import { sumBy } from '~/utils/misc/sum-by';
import { toggle } from '~/utils/misc/toggle';
import { currentUser } from '~/web/config/auth.config';
import { router } from '~/web/config/router.config';
import { isTRPCError, trpc } from '~/web/config/trpc.config';
import { CheckView, CheckViewType } from '~/web/pages/check/check.views';
import { showAlert } from '~/web/utils/behaviors/show-alert';
import { ObservableQueryParam } from '~/web/utils/router/observable-query-param';

export class CheckStore {
  readonly #id: string;
  readonly #subscription = new Subscription();
  readonly #view = new ObservableQueryParam(router, 'view', () => this.#handleDefaultView());

  get view() {
    return this.#view.value;
  }

  /** Активный чек */
  @observable accessor check!: CheckModel;
  /** Лобби (если было создано) */
  @observable accessor lobby!: Nullish<LobbyModel>;
  /** Доступные для выбора товары (для режима выбора своих товаров) */
  @observable accessor selectableItemIds: Array<string> = [];
  /** Выбранные текущим участником чека товары (для режима выбора своих товаров) */
  @observable accessor selfPickedItemIds: Array<string> = [];
  /** Ранее созданные (и уже архивированные) чеки (для режима заполнения драфта) */
  @observable accessor prevChecks: Array<CheckModel> = [];
  /** Доступные для выбора пользователи как участники чека (для режима заполнения драфта) */
  @observable accessor selectableAsParticipantsUsers: Array<UserModel> = [];
  /** Выбранные пользователи как участники чека (для режима заполнения драфта) */
  @observable accessor pickedUserIdsAsParticipants: Array<string> = [];
  /** Общая группа товаров для всех участников чека (для режима заполнения драфта) */
  @observable accessor specifiedCommonItemGroupItemIds: Array<string> = [];
  /** Указанное имя чека (для режима заполнения драфта) */
  @observable accessor specifiedTitle: string = '';
  /** Указанный комментарий (для режима заполнения драфта) */
  @observable accessor specifiedComment: string = '';
  /** Указанная сумма чаевых (для режима заполнения драфта) */
  @observable accessor specifiedTipsSum: number = 0;

  /** Общая сумма чаевых по чеку */
  @computed get tipsValues(): Nullish<CalculatedTipsValues> {
    return calculateTipsValues(this.check);
  }

  /** Мапа с группами товаров */
  @computed get itemGroups(): Map<string, CheckItemGroupModel> {
    return new Map(this.check.itemGroups!.map((itemGroup) => [itemGroup.id, itemGroup]));
  }

  /** Посчитанные суммы по группам товаров */
  @computed get itemGroupsValues(): Map<string, CalculatedItemGroupValues> {
    return new Map(this.check.itemGroups!.map((itemGroup) => [itemGroup.id, calculateItemGroupValues(itemGroup)]));
  }

  /** Мапа с участниками */
  @computed get participants(): Map<string, CheckParticipantModel> {
    return new Map(this.check.participants!.map((participant) => [participant.id, participant]));
  }

  /** Посчитанные суммы товаров по участникам */
  @computed get participantsItemsSums(): Map<string, number> {
    return new Map(this.check.participants!.map((participant) => [participant.id, calculateParticipantItemsSum(participant)]));
  }

  /** Количества товаров по участникам */
  @computed get participantsItemsCounts(): Map<string, number> {
    return new Map(this.check.participants!.map((participant) => [participant.id, participant.items!.length]));
  }

  /** Посчитанные общие суммы по участникам */
  @computed get participantsTotalSums(): Map<string, number> {
    return new Map(
      this.check.participants!.map((participant) => [
        participant.id,
        sumBy(participant.itemGroups!.map((itemGroup) => this.itemGroupsValues.get(itemGroup.id)!.sum)) +
          this.participantsItemsSums.get(participant.id)! +
          (this.tipsValues?.sum ?? 0)
      ])
    );
  }

  /** Участник чека, соответствующий текущему авторизованному пользователю */
  @computed get selfParticipant(): Nullish<CheckParticipantModel> {
    return this.check.participants?.find((participant) => participant.userId === currentUser.id);
  }

  /** Последний используемый комментарий среди ранее созданных чеков */
  @computed get latestPrevCheckComment(): Nullish<string> {
    return this.prevChecks[0]?.comment;
  }

  /** Группы товаров, назначенные на текущего участника чека */
  @computed get selfItemGroups(): Array<CheckItemGroupModel> {
    return this.selfParticipant?.itemGroups ?? [];
  }

  /** Доступные для выбора товары */
  @computed get selectableItems(): Array<CheckItemModel> {
    return this.check.items!.filter((item) => this.selectableItemIds.includes(item.id));
  }

  /** Посчитанная сумма доступных для выбора товары */
  @computed get selectableItemsSum(): number {
    return sumBy(this.selectableItems, 'sum');
  }

  /** Выбранные текущим участником чека товары */
  @computed get selfPickedItems(): Array<CheckItemModel> {
    return this.check.items!.filter((item) => this.selfPickedItemIds.includes(item.id));
  }

  /** Посчитанная сумма товаров текущего участника чека */
  @computed get selfPickedItemsSum(): number {
    return sumBy(this.selfPickedItems, 'sum');
  }

  /** Посчитанная сумма ранее выбранных товаров текущего участника чека */
  @computed get selfPrevPickedItemsSum(): number {
    return this.participantsItemsSums.get(this.selfParticipant!.id)!;
  }

  /** Количество ранее выбранных товаров текущего участника чека */
  @computed get selfPrevPickedItemsCount(): number {
    return this.participantsItemsCounts.get(this.selfParticipant!.id)!;
  }

  /** Посчитанная общая сумма текущего участника чека */
  @computed get selfPendingTotalSum(): number {
    return (
      sumBy(this.selfItemGroups.map((itemGroup) => this.itemGroupsValues.get(itemGroup.id)!.sum)) +
      this.selfPickedItemsSum +
      this.selfPrevPickedItemsSum +
      (this.tipsValues?.sum ?? 0)
    );
  }

  /** Текущий пользователь это автор чека */
  @computed get currentUserAuthor(): boolean {
    return this.check.userId === currentUser.id;
  }

  /** Выбран ли текущий пользователь как участник чека */
  @computed get currentUserPickedAsParticipant(): boolean {
    return this.pickedUserIdsAsParticipants.includes(currentUser.id);
  }

  /** Выбранные пользователи как участники чека */
  @computed get pickedUsersAsParticipants(): Array<UserModel> {
    return [currentUser, ...this.selectableAsParticipantsUsers].filter((user) => this.pickedUserIdsAsParticipants.includes(user.id));
  }

  /** Общая группа товаров для всех участников чека */
  @computed get specifiedCommonItemGroupItems(): Array<CheckItemModel> {
    return this.check.items!.filter((item) => this.specifiedCommonItemGroupItemIds.includes(item.id));
  }

  /** Посчитанная сумма товаров в общей группе товаров */
  @computed get specifiedCommonItemGroupItemsSum(): number {
    return sumBy(this.specifiedCommonItemGroupItems, 'sum');
  }

  /** Товары, которые не были добавлены ни в какие группы */
  @computed get notGroupedItems(): Array<CheckItemModel> {
    return this.check.items!.filter((item) => !this.specifiedCommonItemGroupItemIds.includes(item.id));
  }

  /** Посчитанная сумма товаров, которые не были добавлены ни в какие группы */
  @computed get notGroupedItemsSum(): number {
    return sumBy(this.notGroupedItems, 'sum');
  }

  constructor(id: string) {
    this.#id = id;
  }

  /** Инициализация */
  @mutex async init(): Promise<this> {
    [this.check, this.lobby] = await Promise.all([
      trpc.check.getCheck.query({ id: this.#id }),
      trpc.lobby.getCurrentUserOpenedLobby.query()
    ]);

    await this.#handlePrepareWorkflow();

    return this;
  }

  /** Изменить текущее представление */
  @action handleView = (view: CheckView): void => {
    this.#view.set(view);
  };

  /** Выбрать или снять выбор с товара */
  @action handleToggleSelfPickedItem = (item: CheckItemModel): void => {
    this.selfPickedItemIds = toggle(this.selfPickedItemIds, item.id);
  };

  /** Выбрать или снять выбор с текущего пользователя как участника чека */
  @action handleTogglePickedCurrentUserAsParticipant = (): void => {
    this.pickedUserIdsAsParticipants = toggle(this.pickedUserIdsAsParticipants, currentUser.id);
  };

  /** Выбрать или снять выбор с пользователя как участника чека */
  @action handleTogglePickedUserAsParticipant = (user: UserModel): void => {
    this.pickedUserIdsAsParticipants = toggle(this.pickedUserIdsAsParticipants, user.id);
  };

  /** Выбрать или снять выбор с товара для общей группы */
  @action handleToggleSpecifiedCommonItemGroupItem = (item: CheckItemModel): void => {
    this.specifiedCommonItemGroupItemIds = toggle(this.specifiedCommonItemGroupItemIds, item.id);
  };

  /** Изменить имя чека */
  @action handleChangeSpecifiedTitle = (title: string): void => {
    this.specifiedTitle = title;
  };

  /** Изменить комментарий */
  @action handleChangeSpecifiedComment = (comment: string): void => {
    this.specifiedComment = comment;
  };

  /** Изменить чаевые */
  @action handleChangeSpecifiedTipsSum = (tipsSum: number): void => {
    this.specifiedTipsSum = tipsSum;
  };

  /** Подтвердить публикацию чека */
  @action handleSubmitFillCheck = async (): Promise<void> => {
    await trpc.check.fillCheck.mutate({
      id: this.#id,
      title: this.specifiedTitle,
      comment: this.specifiedComment,
      tipsSum: this.specifiedTipsSum,
      userIdsAsParticipants: this.pickedUsersAsParticipants.map((user) => user.id),
      itemGroups: [
        this.specifiedCommonItemGroupItemIds.length > 0
          ? {
              // Группа "Общее" это самая обычная группа, просто у неё зашито конкретное название вот здесь на фронте
              name: 'Общее',
              userIds: this.pickedUsersAsParticipants.map((user) => user.id),
              itemIds: this.specifiedCommonItemGroupItemIds
            }
          : null
      ].filter(Boolean) satisfies Array<{ name: string; itemIds: Array<string>; userIds: Array<string> }>
    });
  };

  /** Подтвердить заполнение чека (выбор товаров) */
  @action handlePickCheckItems = async (): Promise<void> => {
    try {
      await trpc.check.pickCheckItems.mutate({ id: this.#id, itemIds: this.selfPickedItemIds });
    } catch (error) {
      if (isTRPCError(error) && error.data.cause instanceof InvalidArgumentError) {
        const updatedCheck = await trpc.check.getCheck.query({ id: this.#id });
        this.#handleCheckUpdated(updatedCheck);
      }

      throw error;
    }
  };

  @action handleCompleteCheck = async (): Promise<void> => {
    await trpc.check.completeCheck.mutate({
      id: this.#id
    });
  };

  /** Очистка */
  cleanup(): void {
    this.#subscription.unsubscribe();
    this.#view.cleanup();
  }

  /** Получить представление по умолчанию */
  #handleDefaultView = (): CheckView => {
    switch (this.check.status) {
      case CheckStatus.DRAFT: {
        return { type: CheckViewType.FILL_PARTICIPANTS };
      }
      case CheckStatus.ACTIVE: {
        if (this.selfParticipant && !this.selfParticipant.filled) {
          return { type: CheckViewType.PICK_ITEMS };
        } else {
          return { type: CheckViewType.INFO };
        }
      }
      case CheckStatus.COMPLETED:
      case CheckStatus.ARCHIVE: {
        return { type: CheckViewType.INFO };
      }
      default: {
        return exhaustiveCheck(this.check.status);
      }
    }
  };

  #handlePrepareWorkflow = async (): Promise<void> => {
    this.#view.init();

    switch (this.check.status) {
      case CheckStatus.DRAFT: {
        [this.selectableAsParticipantsUsers, this.prevChecks] = await Promise.all([
          trpc.user.getUserFriends.query({ id: currentUser.id }),
          trpc.check.getCreatedChecks.query({ userId: currentUser.id, archived: true })
        ]);
        this.pickedUserIdsAsParticipants = this.lobby
          ? this.lobby.participants!.map((participant) => participant.userId)
          : [currentUser.id];

        break;
      }
      case CheckStatus.ACTIVE: {
        this.selectableItemIds = this.check.items!.filter((item) => !item.groupId && !item.participantId).map((item) => item.id);
        this.#handleSubscribeUpdates();

        break;
      }
      // no default
    }
  };

  /** Подписка на обновление чека */
  #handleSubscribeUpdates = (): void => {
    this.#subscription.add(
      trpc.check.onCheckUpdated.subscribe({ id: this.#id }, { onData: (updatedCheck) => this.#handleCheckUpdated(updatedCheck, true) })
    );
  };

  /** Реакция на обновление чека */
  #handleCheckUpdated = (updatedCheck: CheckModel, shouldAlert: boolean = false): void => {
    const unavailableItems =
      this.selfPickedItemIds.length > 0
        ? updatedCheck.items!.filter(
            (item) => !!item.participantId && item.participantId !== this.selfParticipant!.id && this.selfPickedItemIds.includes(item.id)
          )
        : [];

    if (shouldAlert && unavailableItems.length) {
      showAlert(
        'warning',
        'Кое-что поменялось',
        unavailableItems.length === 1
          ? `Кто-то другой уже забрал «${unavailableItems[0].name}» на себя`
          : `${formatPlural(unavailableItems.length, '{} твой товар', '{} твоих товара', '{} твоих товаров')} кто-то уже забрал на себя`
      );
    }

    runInAction(() => {
      this.check = updatedCheck;

      if (unavailableItems.length) {
        const unavailableItemIds = unavailableItems.map((item) => item.id);
        this.selfPickedItemIds = this.selfPickedItemIds.filter((id) => !unavailableItemIds.includes(id));
      }
    });
  };
}
