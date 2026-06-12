// Диплинк на бота
export const deepLinkUrl = (payload: string, group: boolean = false) =>
  `https://t.me/${process.env.TELEGRAM_BOT_USERNAME}?${group ? 'startgroup' : 'start'}=${payload}`;

// Ссылка на страницу с пользователями
export const webUsersUrl = `${process.env.WEB_PUBLIC_URL}/users`;

// Ссылка на страницу конкретного пользователя
export const webUserUrl = (id: string) => `${process.env.WEB_PUBLIC_URL}/users/${id}`;

// Ссылка на страницу чека
export const webCheckUrl = (id: string) => `${process.env.WEB_PUBLIC_URL}/checks/${id}`;

// Ссылка на страницу лобби расчёта
export const webLobbyUrl = (id: string) => `${process.env.WEB_PUBLIC_URL}/lobby/${id}`;
