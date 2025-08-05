import emojiRegex from 'emoji-regex';

const regex = new RegExp(`^(?:${emojiRegex().source})$`);

export function isEmoji(value: string): boolean {
  return regex.test(value);
}
