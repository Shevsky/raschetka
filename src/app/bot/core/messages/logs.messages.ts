import { TypedMessage } from '~/app/bot/types/message';

export function getLogsInvalidUsageMessage() {
  return [`🙅‍♂️ Так это использовать нельзя. Укажи число, например: /logs 30`] satisfies TypedMessage;
}

export function getLogsMessage(logs: string) {
  return [
    `\`\`\`\n${logs}\n\`\`\``,
    {
      parse_mode: 'Markdown'
    }
  ] satisfies TypedMessage;
}
