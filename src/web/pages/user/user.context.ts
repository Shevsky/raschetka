import { createContext } from 'react';
import { UserStore } from '~/web/pages/user/user.store';

export const UserContext = createContext<UserStore>(null!);
