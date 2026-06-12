/* eslint-disable import/no-restricted-paths */

import {
  createTRPCClient,
  createWSClient,
  httpBatchLink,
  splitLink,
  TRPCClient,
  TRPCClientError,
  TRPCClientErrorBase,
  wsLink
} from '@trpc/client';
import type { DefaultErrorShape } from '@trpc/server/unstable-core-do-not-import';
import superjson from 'superjson';
import type { TRPCRouter } from '~/app/api/core/routers/trpc.router';

export type TRPCError = Omit<TRPCClientErrorBase<DefaultErrorShape>, 'data'> & {
  data: {
    cause?: Error;
  };
};

export function isTRPCError(error: unknown): error is TRPCError {
  return error instanceof TRPCClientError;
}

export const trpc: TRPCClient<TRPCRouter> = createTRPCClient<TRPCRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === 'subscription',
      true: wsLink({
        client: createWSClient({
          url: `wss://${location.host}/api/trpc`,
          lazy: { enabled: true, closeMs: 0 },
          keepAlive: { enabled: true }
        }),
        transformer: superjson
      }),
      false: httpBatchLink({
        url: '/api/trpc',
        transformer: superjson,
        async headers() {
          return {};
        }
      })
    })
  ]
});
