import { NotificationCard } from '~/web/components/cards/notification-card';

export const NotificationSection = () => {
  return (
    <NotificationCard withClose>
      📋 Выбери свои товары и&nbsp;нажми кнопку <b>&laquo;Продолжить&raquo;</b> внизу.
      <br />
      <br />
      Можно скроллить вниз ⬇️
    </NotificationCard>
  );
};
