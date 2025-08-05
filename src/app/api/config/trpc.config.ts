import { initTRPC } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import superjson from 'superjson';

export function createContext({ req, res }: CreateFastifyContextOptions) {
  return { req, res };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => {
    return {
      ...shape,
      message: `${shape.message}\n'${shape.data.path}' (${shape.data.httpStatus})`,
      data: {
        ...shape.data,
        cause: error.cause instanceof Error ? error.cause : undefined,
        stack: process.env.NODE_ENV === 'production' ? undefined : shape.data.stack
      }
    };
  }
});
