'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth/auth-client';
import { deleteOrganizationInvitation, updateInvitationRole } from '@/lib/api/organizations';
import type { UpdateInvitationRolePayload } from '@/lib/schemas/role.schema';
import type { OrgInvitation } from '@/lib/types/invitation.types';
import { getInvitationStatus } from '@/lib/utils/invitation.utils';
import { getRoleLabel, type OrgRole } from '@/lib/utils/roles.utils';

type UseInvitationRoleCellArgs = {
    invitation: OrgInvitation;
    organizationId: string;
    onChanged: () => void;
};

export default function useInvitationRoleCell({
    invitation,
    organizationId,
    onChanged,
}: UseInvitationRoleCellArgs) {
    const [updating, setUpdating] = useState(false);
    const [currentRole, setCurrentRole] = useState(invitation.role);

    const handleRoleChange = async (newRole: string) => {
        if (newRole === currentRole) return;
        setUpdating(true);
        const previousRole = currentRole;
        setCurrentRole(newRole);
        try {
            await updateInvitationRole(organizationId, invitation.id, {
                role: newRole as UpdateInvitationRolePayload['role'],
            });
            toast.success(`Invitation updated to ${getRoleLabel(newRole)}`);
            onChanged();
        } catch {
            setCurrentRole(previousRole);
            toast.error('Failed to update invitation role');
        } finally {
            setUpdating(false);
        }
    };

    const handleRemoveInvitation = async () => {
        setUpdating(true);
        try {
            await deleteOrganizationInvitation(organizationId, invitation.id);
            toast.success('Invitation removed');
            onChanged();
        } catch {
            toast.error('Failed to remove invitation');
        } finally {
            setUpdating(false);
        }
    };

    const handleResendInvite = async () => {
        setUpdating(true);
        try {
            const isExpired = getInvitationStatus(invitation) === 'invite-expired';
            if (isExpired) {
                await deleteOrganizationInvitation(organizationId, invitation.id);
            }
            await authClient.organization.inviteMember({
                email: invitation.email,
                role: currentRole as OrgRole,
                organizationId,
                resend: !isExpired,
            });
            toast.success('Invitation resent');
            onChanged();
        } catch {
            toast.error('Failed to resend invitation');
        } finally {
            setUpdating(false);
        }
    };

    return {
        updating,
        currentRole,
        handleRoleChange,
        handleRemoveInvitation,
        handleResendInvite,
    };
}
