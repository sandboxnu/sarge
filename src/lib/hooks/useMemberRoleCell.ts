'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth/auth-client';
import { getRoleLabel, type OrgRole } from '@/lib/utils/roles.utils';
import type { MemberWithUser } from '@/lib/types/member.types';

type UseMemberRoleCellArgs = {
    member: MemberWithUser;
    organizationId: string;
    onChanged: () => void;
};

export default function useMemberRoleCell({
    member,
    organizationId,
    onChanged,
}: UseMemberRoleCellArgs) {
    const [updating, setUpdating] = useState(false);
    const [currentRole, setCurrentRole] = useState(member.role);
    const isOwner = currentRole === 'owner';

    const handleRoleChange = async (newRole: string) => {
        if (newRole === currentRole) return;
        setUpdating(true);
        const previousRole = currentRole;
        setCurrentRole(newRole);
        try {
            await authClient.organization.updateMemberRole({
                memberId: member.id,
                role: newRole as OrgRole,
                organizationId,
            });
            toast.success(`${member.user.name}'s role updated to ${getRoleLabel(newRole)}`);
            onChanged();
        } catch {
            setCurrentRole(previousRole);
            toast.error('Failed to update role');
        } finally {
            setUpdating(false);
        }
    };

    const handleRemoveMember = async () => {
        setUpdating(true);
        try {
            await authClient.organization.removeMember({
                memberIdOrEmail: member.id,
                organizationId,
            });
            toast.success(`${member.user.name ?? member.user.email} removed from organization`);
            onChanged();
        } catch {
            toast.error('Failed to remove member');
        } finally {
            setUpdating(false);
        }
    };

    return {
        updating,
        currentRole,
        isOwner,
        handleRoleChange,
        handleRemoveMember,
    };
}
