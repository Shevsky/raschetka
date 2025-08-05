export enum CheckViewType {
  /** Общая информация о чеке */
  INFO = 'info',
  /** Информация о товарах в чеке */
  ITEMS = 'items',
  /** Заполнение участников для чека */
  FILL_PARTICIPANTS = 'fill-participants',
  /** Заполнение групп товаров (общее) */
  FILL_ITEM_GROUPS = 'fill-item-groups',
  /** Заполнение дополнительной информации (имя чека, описание куда скидывать деньги и чаевые) */
  FILL_ADDITIONAL_DATA = 'fill-additional-data',
  /** Подтверждение заполнения чека */
  CONFIRM_FILL = 'confirm-fill',
  /** Просмотр участника чека (что он натыкал) */
  SEE_PARTICIPANT = 'see-participant',
  /** Просмотр группы товаров (что внутри) */
  SEE_ITEM_GROUP = 'see-item-group',
  /** Выбор товаров для участника */
  PICK_ITEMS = 'pick-items',
  /** Подтверждение выбранных товаров для участника */
  CONFIRM_PICKED_ITEMS = 'confirm-picked-items'
}

export type CheckView =
  | { type: CheckViewType.INFO }
  | { type: CheckViewType.ITEMS }
  | { type: CheckViewType.FILL_PARTICIPANTS }
  | { type: CheckViewType.FILL_ITEM_GROUPS }
  | { type: CheckViewType.FILL_ADDITIONAL_DATA }
  | { type: CheckViewType.CONFIRM_FILL }
  | { type: CheckViewType.SEE_PARTICIPANT; payload: { id: string } }
  | { type: CheckViewType.SEE_ITEM_GROUP; payload: { id: string } }
  | { type: CheckViewType.PICK_ITEMS }
  | { type: CheckViewType.CONFIRM_PICKED_ITEMS };
