'use client';

import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { useSession, useActiveOrganization, useActiveMember } from '@/lib/auth/auth-client';
import { SUPER_USER_ROLE } from '@/lib/auth/permissions';

type SessionData = {
    user: {
        id: string;
        email: string;
        name: string;
        image?: string | null | undefined;
        role?: string | null | undefined;
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
    image?: string | null | undefined;
    role?: string | null | undefined;
};

type MemberData = {
    id: string;
    role: string;
};

interface AuthContextValue {
    session: SessionData | null; // when user is not signed in, session is null
    user: UserData | null; // when user is not signed in, user is null
    userId: string | null;

    activeOrganization: OrganizationData | null;
    activeOrganizationId: string | null;

    activeMember: MemberData | null;
    activeMemberId: string | null;

    isPending: boolean;
    sessionPending: boolean;
    orgPending: boolean;
    memberPending: boolean;

    isAuthenticated: boolean;
    hasActiveOrganization: boolean;
    isSuperUser: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const { data: session, isPending: sessionPending } = useSession();
    const {
        data: activeOrganization,
        isPending: orgPending,
        refetch: refetchOrganization,
    } = useActiveOrganization();
    const {
        data: activeMember,
        isPending: memberPending,
        refetch: refetchMember,
    } = useActiveMember();

    const sessionUserId = session?.user?.id;
    const sessionOrgId = session?.session?.activeOrganizationId;

    useEffect(() => {
        refetchOrganization();
        refetchMember();
    }, [sessionUserId, sessionOrgId, refetchOrganization, refetchMember]);

    const value = useMemo<AuthContextValue>(() => {
        const user = session?.user ?? null;
        const userId = user?.id ?? null;
        const currentOrganization =
            activeOrganization?.id === session?.session?.activeOrganizationId
                ? activeOrganization
                : null;
        const activeOrganizationId = currentOrganization?.id ?? null;
        const activeMemberId = activeMember?.id ?? null;

        return {
            session,
            user,
            userId,

            activeOrganization: currentOrganization,
            activeOrganizationId,

            activeMember,
            activeMemberId,

            isPending: sessionPending || orgPending || memberPending,
            sessionPending,
            orgPending,
            memberPending,

            isAuthenticated: !!session?.user,
            hasActiveOrganization: !!session?.session?.activeOrganizationId,
            isSuperUser: session?.user?.role === SUPER_USER_ROLE,
        };
    }, [session, activeOrganization, activeMember, sessionPending, orgPending, memberPending]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 *  hook to access auth context
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
    const { activeOrganization, activeOrganizationId, hasActiveOrganization, orgPending } =
        useAuth();
    return {
        activeOrganization,
        activeOrganizationId,
        hasActiveOrganization,
        isPending: orgPending,
    };
}

/**
 * Hook to get only member data (for components that don't need session or organization data)
 */
export function useAuthMember() {
    const { activeMember, activeMemberId, isPending: memberPending } = useAuth();
    return {
        activeMember,
        activeMemberId,
        isPending: memberPending,
    };
}
