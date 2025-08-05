import type { Context } from 'grammy';

export type TypedMessage = [text: string, options?: Parameters<Context['reply']>[1]];
