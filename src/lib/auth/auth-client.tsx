'use client';

import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { type User } from '@/lib/types';

interface AuthContextType {
    user: User;
    isPending: boolean;
}

export const UserContext = createContext<AuthContextType | null>(null);
export function UserProvider({ children }: { children: ReactNode }) {
    const [isPending, setIsPending] = useState(true);
    const [user, setUser] = useState<User>({ id: null, name: null, email: null, orgId: null, orgName: null });

    useEffect(() => {
        async function getUser() {
            try {
                const res = await fetch('/api/auth/me').then((r) => r.json());
                setUser(res.data);
            } finally {
                setIsPending(false);
            }
        }
        getUser();
    }, []);

    return <UserContext.Provider value={{ user, isPending }}>{children}</UserContext.Provider>;
}

export function useAuth() {
    const context = useContext(UserContext);
    if (!context) {
        throw Error('User context not found');
    }
    return context;
}
