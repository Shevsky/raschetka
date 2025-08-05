import { NotificationCard } from '~/web/components/cards/notification-card';

export const NotificationSection = () => {
  return (
    <NotificationCard withClose>
      ✍️ Заполни участников чека — тех, между кеми нужно будет разбить чек.
      <br />
      <br />
      Если здесь нет нужных людей — перешли им свою пригласительную ссылку 👻
    </NotificationCard>
  );
};
