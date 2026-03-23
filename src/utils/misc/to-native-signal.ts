export function toNativeSignal(source: AbortSignal): AbortSignal {
  const controller = new AbortController();

  if (source.aborted) {
    controller.abort(source.reason);

    return controller.signal;
  }

  const onAbort = () => controller.abort(source.reason);

  source.addEventListener('abort', onAbort, { once: true });

  return controller.signal;
}
