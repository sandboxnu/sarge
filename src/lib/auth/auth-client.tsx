'use client';

import { createContext, type ReactNode, useContext } from 'react';
import { useSession } from '@/lib/auth/better-auth-client';
import { type User } from '@/lib/types';

interface AuthContextType {
    user: User | null;
    isPending: boolean;
}

export const UserContext = createContext<AuthContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
    const { data: session, isPending } = useSession();

    const user = session?.user
        ? {
              id: session.user.id,
              name: session.user.name || null,
              email: session.user.email || null,
          }
        : null;

    return <UserContext.Provider value={{ user, isPending }}>{children}</UserContext.Provider>;
}

export function useAuth() {
    const context = useContext(UserContext);
    if (!context) {
        throw Error('User context not found');
    }
    return context;
}
