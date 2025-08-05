import { ReactNode, useContext, useEffect, useInsertionEffect, useRef } from 'react';
import { ScrollableContext } from '~/web/contexts/scrollable.context';

type InfiniteScrollProps = {
  children: ReactNode;
  fallback: ReactNode;
  disabled?: boolean;
  onLoad(): void | Promise<void>;
  onError(error: unknown): void;
};

// Запускаем вызов onLoad (подгрузки для следующих страниц) как только будет около 250 пикселей до конца
const rootMargin = '0px 0px 300px 0px';
const threshold = 0;

export function InfiniteScroll({ children, fallback, disabled, onLoad, onError }: InfiniteScrollProps) {
  const scrollableRef = useContext(ScrollableContext);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const isPendingRef = useRef(false);
  const latestLoadHandlerRef = useRef(onLoad);
  const latestErrorHandlerRef = useRef(onError);

  useInsertionEffect(() => {
    latestLoadHandlerRef.current = onLoad;
    latestErrorHandlerRef.current = onError;
  });

  useEffect(() => {
    const scrollable = scrollableRef.current;
    const sentinel = sentinelRef.current;

    if (!scrollable || !sentinel || disabled) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries: Array<IntersectionObserverEntry>) => {
        if (entries[0]?.isIntersecting && !isPendingRef.current) {
          const load = latestLoadHandlerRef.current();

          if (load instanceof Promise) {
            isPendingRef.current = true;
            load
              .catch((error) => {
                if (latestErrorHandlerRef.current) {
                  return latestErrorHandlerRef.current(error);
                }

                throw error;
              })
              .finally(() => {
                isPendingRef.current = false;
              });
          }
        }
      },
      { root: scrollable, rootMargin, threshold }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [scrollableRef, disabled]);

  return (
    <>
      {children}
      <div ref={sentinelRef}>{!disabled && fallback}</div>
    </>
  );
}
