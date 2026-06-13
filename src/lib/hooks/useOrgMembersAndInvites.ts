'use client';

import { useCallback, useEffect, useState } from 'react';
import type { MemberWithUser } from '@/lib/types/member.types';
import type { OrgInvitation } from '@/lib/types/invitation.types';
import { getOrganizationMembers } from '@/lib/api/organizations';

export function useOrgMembersAndInvites(organizationId: string | undefined) {
    const [members, setMembers] = useState<MemberWithUser[]>([]);
    const [invitations, setInvitations] = useState<OrgInvitation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const load = useCallback(async () => {
        if (!organizationId) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const data = await getOrganizationMembers(organizationId);
            setMembers(
                data.members.map((m) => ({
                    ...m,
                    createdAt: new Date(m.createdAt),
                }))
            );

            setInvitations(
                data.invitations.map((i) => ({
                    ...i,
                    createdAt: new Date(i.createdAt),
                    expiresAt: new Date(i.expiresAt),
                }))
            );
        } catch (e) {
            setError(e instanceof Error ? e : new Error('Failed to load members'));
        } finally {
            setIsLoading(false);
        }
    }, [organizationId]);

    useEffect(() => {
        load();
    }, [load]);

    return {
        members,
        invitations,
        memberCount: members.length,
        isLoading,
        error,
        refresh: load,
    };
}
