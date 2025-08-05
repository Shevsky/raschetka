import { MemorySessionStorage, SessionOptions } from 'grammy';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Session = Record<string, any>;

// 20 мин
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const sessionTtl = 20 * 60 * 1000;

export const sessionOptions = {
  storage: new MemorySessionStorage<Session>(sessionTtl),
  initial: () => ({}),
  getSessionKey: (ctx) => `${ctx.from?.id}/${ctx.chat?.id}`
} satisfies SessionOptions<Session>;
