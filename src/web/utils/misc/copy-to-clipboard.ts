import { noop } from '~/utils/misc/noop';

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text).catch(noop);
}
