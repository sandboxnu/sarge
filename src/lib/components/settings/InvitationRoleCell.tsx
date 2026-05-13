'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/lib/components/ui/Dropdown';
import { authClient } from '@/lib/auth/auth-client';
import { deleteOrganizationInvitation, updateInvitationRole } from '@/lib/api/organizations';
import type { UpdateInvitationRolePayload } from '@/lib/schemas/role.schema';
import type { OrgInvitation } from '@/lib/types/invitation.types';
import { getInvitationStatus } from '@/lib/utils/invitation.utils';
import { getAssignableRoles, getRoleLabel, type OrgRole } from '@/lib/utils/roles.utils';

type InvitationRoleCellProps = {
    invitation: OrgInvitation;
    organizationId: string;
    onChanged: () => void;
};

export default function InvitationRoleCell({
    invitation,
    organizationId,
    onChanged,
}: InvitationRoleCellProps) {
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

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    disabled={updating}
                    className="border-sarge-gray-200 bg-sarge-gray-0 text-sarge-gray-800 hover:bg-sarge-gray-50 data-[state=open]:bg-sarge-gray-50 focus:bg-sarge-gray-50 focus:ring-sarge-primary-500 flex h-11 w-full items-center justify-between rounded-lg border px-3 py-2 transition-colors focus:ring-2 focus:outline-none focus:ring-inset disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <span className="text-label-s truncate">{getRoleLabel(currentRole)}</span>
                    <ChevronDown className="size-4 shrink-0 opacity-50" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                    <DropdownMenuRadioGroup
                        value={currentRole}
                        onValueChange={(r) => handleRoleChange(r)}
                    >
                        {getAssignableRoles().map((r) => (
                            <DropdownMenuRadioItem key={r} value={r} disabled={updating}>
                                {getRoleLabel(r)}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        inset
                        disabled={updating}
                        onSelect={() => handleResendInvite()}
                    >
                        Resend invite
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        inset
                        variant="destructive"
                        disabled={updating}
                        onSelect={() => handleRemoveInvitation()}
                    >
                        Remove
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
