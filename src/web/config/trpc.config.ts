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
import type { ApiRouter } from '~/app/api/core/routers/api.router';

export type TRPCError = Omit<TRPCClientErrorBase<DefaultErrorShape>, 'data'> & {
  data: {
    cause?: Error;
  };
};

export function isTRPCError(error: unknown): error is TRPCError {
  return error instanceof TRPCClientError;
}

export const trpc: TRPCClient<ApiRouter> = createTRPCClient<ApiRouter>({
  links: [
    httpBatchLink({
      url: '/api',
      transformer: superjson,
      async headers() {
        return {};
      }
    })
  ]
});
