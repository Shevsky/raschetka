import { createContext, RefObject } from 'react';

export const ScrollableContext = createContext<RefObject<Nullish<HTMLElement>>>({ current: document.body });
