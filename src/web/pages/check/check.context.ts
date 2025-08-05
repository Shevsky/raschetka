import { createContext } from 'react';
import { CheckStore } from '~/web/pages/check/check.store';

export const CheckContext = createContext<CheckStore>(null!);
