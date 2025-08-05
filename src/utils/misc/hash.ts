/** Простой детерминированный хеш строки в число */
export function hash(input: string): number {
  let output = 0;

  for (const ch of input) {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    output = (output << 5) - output + ch.codePointAt(0)!;
    output = Math.trunc(output); // привести к 32-битному int
  }

  return Math.abs(output);
}
