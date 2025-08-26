import { TypedMessage } from '~/app/bot/types/message';

export function getF2BInvalidUsageMessage() {
  return [`🙅‍♂️ Так это использовать нельзя. Укажи известную команду: /f2b list, /f2b ban <ip> или /f2b unban <ip>`] satisfies TypedMessage;
}

export function getF2BInvalidIPMessage() {
  return [`🙅‍♂️ IP-адрес указан некорректно`] satisfies TypedMessage;
}

export function getF2BListMessage(ips: Array<string>) {
  return [
    ips.length ? `**💀 Заблокированные IP-адреса:**\n\n\`\`\`\n${ips.join('\n')}\n\`\`\`` : '💀 Нет заблокированных IP-адресов',
    {
      parse_mode: 'Markdown'
    }
  ] satisfies TypedMessage;
}

export function getF2BBannedMessage(ip: string) {
  return [`🤫 Забанили IP-адрес ${ip}`] satisfies TypedMessage;
}

export function getF2BUnbannedMessage(ip: string) {
  return [`🤔 Разбанили IP-адрес ${ip}`] satisfies TypedMessage;
}
