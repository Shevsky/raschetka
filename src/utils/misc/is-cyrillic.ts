export function isCyrillic(value: string): boolean {
  return /[а-яё]/.test(value);
}
