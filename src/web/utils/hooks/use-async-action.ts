import { useCallback, useEffect, useInsertionEffect, useRef, useState } from 'react';

type AsyncActionConfig<Data, Args extends Array<unknown>> = {
  /** Обработчик успешного выполнения действия */
  onSuccess?: (result: Data) => void | Promise<void>;
  /** Обработчик ошибки при выполнении действия */
  onError?: (error: unknown) => void;
  /** Функция подтверждения, которая должна быть вызвана перед действием */
  onConfirm?: (...args: Args) => boolean | Promise<boolean>;
};

const defaultHandleError = (error: unknown) => Promise.reject(error);

/** Хук для асинхронных действий, возвращающий новую функцию и статус ее загрузки isLoading */
export function useAsyncAction<Data, Args extends Array<unknown>>(
  callback: (...args: Args) => Data | Promise<Data>,
  { onSuccess, onError = defaultHandleError }: AsyncActionConfig<Data, Args> = {}
): [action: (...args: Args) => void, isLoading: boolean] {
  const mountedRef = useRef(false);
  const pendingRef = useRef(false);

  const latestCallbackRef = useRef(callback);
  const latestSuccessHandlerRef = useRef(onSuccess);
  const latestErrorHandlerRef = useRef(onError);

  useInsertionEffect(() => {
    latestCallbackRef.current = callback;
    latestSuccessHandlerRef.current = onSuccess;
    latestErrorHandlerRef.current = onError;
  });

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const [isLoading, setLoading] = useState(false);

  const handleAction = useCallback((...args: Args) => {
    if (pendingRef.current) {
      return;
    }

    function handlePending(isPending: boolean): void {
      if (isPending === pendingRef.current) {
        return;
      }

      setLoading(isPending);
      pendingRef.current = isPending;
    }

    function handleSuccess(value: Data): void | Promise<void> {
      if (!mountedRef.current) {
        return;
      }

      return latestSuccessHandlerRef.current?.(value);
    }

    function handleError(error: unknown): void {
      if (!mountedRef.current) {
        // Выкидываем ошибку наверх чз Promise.reject, чтоб она не улетала в основной поток
        console.warn('Возникла ошибка на уже отмонтированном компоненте');
        void Promise.reject(error);

        return;
      }

      return latestErrorHandlerRef.current?.(error);
    }

    try {
      const result = latestCallbackRef.current(...args);

      if (result instanceof Promise) {
        handlePending(true);

        result
          .then(handleSuccess)
          .catch(handleError)
          .finally(() => handlePending(false));
      }
    } catch (error) {
      latestErrorHandlerRef.current?.(error);
    }
  }, []);

  return [handleAction, isLoading];
}
