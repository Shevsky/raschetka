import { TypedBot } from '~/app/bot/types/bot';

/** 🚁 Регистрирует список доступных команд, чтоб в боте высвечивалось */
export async function registerAvailableCommands(bot: TypedBot): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  await bot.api.setMyCommands([
    {
      command: 'start',
      description: 'Начать работу с ботом'
    },
    {
      command: 'invite',
      description: 'Получить пригласительную ссылку'
    },
    {
      command: 'me',
      description: 'Информация о себе внутри бота'
    },
    {
      command: 'friends',
      description: 'Мои друзья, зарегистрированные в боте'
    },
    {
      command: 'help',
      description: 'Напомнить что это за бот и зачем'
    }
  ]);
}
