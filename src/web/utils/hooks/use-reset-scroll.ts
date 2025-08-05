import { DependencyList, useContext, useEffect, useRef } from 'react';
import { ScrollableContext } from '~/web/contexts/scrollable.context';

export function useResetScroll(deps: DependencyList): void {
  const scrollableRef = useContext(ScrollableContext);
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
    } else {
      const scrollable = scrollableRef.current;

      if (scrollable) {
        scrollable.scrollTo({ top: 0, behavior: 'instant' });
      }
    }
  }, deps);
}
