'use client';

import { createContext, type ReactNode, useContext } from 'react';
import { useSession } from '@/lib/auth/better-auth-client';
import { type User } from '@/lib/types/user-types';

interface AuthContextType {
    user: User | null;
    isPending: boolean;
}

export const UserContext = createContext<AuthContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
    const { data: session, isPending } = useSession();

    //TODO: when we update to multiple orgs we'll use better auth plugins
    const user = session?.user
        ? {
              id: session.user.id,
              name: session.user.name || null,
              email: session.user.email || null,
              orgId: (session.user as { orgId?: string | null }).orgId ?? null, // <3 typescript
              orgName: (session.user as { orgName?: string | null }).orgName ?? null,
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
