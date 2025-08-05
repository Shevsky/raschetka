import { createContext } from 'react';
import { UsersStore } from '~/web/pages/users/users.store';

export const UsersContext = createContext<UsersStore>(null!);
