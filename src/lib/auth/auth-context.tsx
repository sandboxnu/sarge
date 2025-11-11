'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useSession, useActiveOrganization } from '@/lib/auth/auth-client';

type SessionData = {
    user: {
        id: string;
        email: string;
        name: string;
        image?: string | null | undefined;
    };
    session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        activeOrganizationId?: string | null | undefined;
    };
};

type OrganizationData = {
    id: string;
    name: string;
    slug: string;
    logo?: string | null | undefined;
};

type UserData = {
    id: string;
    email: string;
    name: string;
};

interface AuthContextValue {
    session: SessionData | null; // when user is not signed in, session is null
    user: UserData | null; // when user is not signed in, user is null
    userId: string | null;

    activeOrganization: OrganizationData | null;
    activeOrganizationId: string | null;

    isPending: boolean;
    sessionPending: boolean;
    orgPending: boolean;

    isAuthenticated: boolean;
    hasActiveOrganization: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const { data: session, isPending: sessionPending } = useSession();
    const { data: activeOrganization, isPending: orgPending } = useActiveOrganization();

    const value = useMemo<AuthContextValue>(() => {
        const user = session?.user ?? null;
        const userId = user?.id ?? null;
        const activeOrganizationId = activeOrganization?.id ?? null;

        return {
            session,
            user,
            userId,

            activeOrganization,
            activeOrganizationId,

            isPending: sessionPending || orgPending,
            sessionPending,
            orgPending,

            isAuthenticated: !!session?.user,
            hasActiveOrganization: !!session?.session?.activeOrganizationId,
        };
    }, [session, activeOrganization, sessionPending, orgPending]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to access auth context
 * @throws Error if used outside AuthProvider
 */
export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

/**
 * Hook to get only session data (for components that don't need org data)
 */
export function useAuthSession() {
    const { session, user, userId, isAuthenticated, sessionPending } = useAuth();
    return { session, user, userId, isAuthenticated, isPending: sessionPending };
}

/**
 * Hook to get only organization data (for components that don't need session data)
 */
export function useAuthOrganization() {
    const { activeOrganizationId, hasActiveOrganization, orgPending } = useAuth();
    return {
        activeOrganizationId,
        hasActiveOrganization,
        isPending: orgPending,
    };
}
