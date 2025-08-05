import { TypedMessage } from '~/app/bot/types/message';

export function getLogsInvalidUsageMessage() {
  return [`🙅‍♂️ Так это использовать нельзя. Укажи число, например: /logs 30`] satisfies TypedMessage;
}

export function getLogsMessage(logs: string) {
  return [
    `<pre>${logs}</pre>`,
    {
      parse_mode: 'HTML'
    }
  ] satisfies TypedMessage;
}
