import dedent from 'dedent';
import { TypedMessage } from '~/app/bot/types/message';
import { drinksEmojis, fruitsEmojis, preparedFoodsEmojis } from '~/utils/dicts/emojis.dict';
import { choice } from '~/utils/misc/choice';

export function getWelcomeMessage() {
  return [
    dedent`
      👋 Йоу, это Расчётка Бот 🤖 Я помогаю разбивать чеки из рестиков ${choice(preparedFoodsEmojis)} и упрощаю расчёты 🧮

      Просто закинь в меня фотку чека (QR код) или его json, а дальше я сделаю всю магию 🪄 Тебе останется только пригласить друзей для РАЗБИВКИ чека 👻

      🤔 Под РАЗБИВКОЙ я имею ввиду когда все челики выберут галочками в чеке те товары, которые заказали они ${choice(drinksEmojis)}

      А пока что на этом всё ${choice(fruitsEmojis)} Как только кто-то создаст чек и пригласит тебя в него, я пришлю тебе пушик 🤙

      <i>Ах да, создавать новые чеки могут только избранные 🥷</i>
    `,
    {
      parse_mode: 'HTML'
    }
  ] satisfies TypedMessage;
}

export function getWelcomeButRegisteredMessage() {
  return [
    dedent`
      Ты уже зарегистрирован в боте 🤙

      <i>А если нужны подробности, то отправь мне /help</i>
    `,
    {
      parse_mode: 'HTML'
    }
  ] satisfies TypedMessage;
}
