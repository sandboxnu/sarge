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
import { Chip } from '@/lib/components/ui/Chip';
import { authClient } from '@/lib/auth/auth-client';
import { deleteOrganizationInvitation, updateInvitationRole } from '@/lib/api/organizations';
import type { UpdateInvitationRolePayload } from '@/lib/schemas/role.schema';
import type { OrgInvitation } from '@/lib/types/invitation.types';
import {
    getInvitationStatus,
    getMemberRowStatusLabel,
    getMemberRowStatusVariant,
} from '@/lib/utils/invitation.utils';
import { formatShortMonthDayYear } from '@/lib/utils/date.utils';
import { getAssignableRoles, getRoleLabel, type OrgRole } from '@/lib/utils/roles.utils';

type InvitationRowProps = {
    invitation: OrgInvitation;
    organizationId: string;
    onRoleChanged: () => void;
};

export default function InvitationRow({
    invitation,
    organizationId,
    onRoleChanged,
}: InvitationRowProps) {
    const [busy, setBusy] = useState(false);
    const [currentRole, setCurrentRole] = useState(invitation.role);
    const status = getInvitationStatus(invitation);
    const initial = invitation.email[0]?.toUpperCase() ?? '?';
    const createdLabel = formatShortMonthDayYear(invitation.createdAt);

    const handleRoleChange = async (newRole: string) => {
        if (newRole === currentRole) return;
        setBusy(true);
        const previous = currentRole;
        setCurrentRole(newRole);
        try {
            await updateInvitationRole(organizationId, invitation.id, {
                role: newRole as UpdateInvitationRolePayload['role'],
            });
            toast.success(`Invitation updated to ${getRoleLabel(newRole)}`);
            onRoleChanged();
        } catch {
            setCurrentRole(previous);
            toast.error('Failed to update invitation role');
        } finally {
            setBusy(false);
        }
    };

    const handleRemoveInvitation = async () => {
        setBusy(true);
        try {
            await deleteOrganizationInvitation(organizationId, invitation.id);
            toast.success('Invitation removed');
            onRoleChanged();
        } catch {
            toast.error('Failed to remove invitation');
        } finally {
            setBusy(false);
        }
    };

    const handleResendInvite = async () => {
        setBusy(true);
        try {
            const isExpired = status === 'invite-expired';
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
            onRoleChanged();
        } catch {
            toast.error('Failed to resend invitation');
        } finally {
            setBusy(false);
        }
    };

    return (
        <tr className="hover:bg-sarge-gray-50 border-sarge-gray-200 border-b">
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="bg-sarge-gray-200 text-sarge-gray-600 text-label-s flex h-10 w-10 items-center justify-center rounded-full">
                        {initial}
                    </div>
                    <span className="text-label-xs text-sarge-gray-500">{invitation.email}</span>
                </div>
            </td>
            <td className="text-label-s px-4 py-3">{createdLabel}</td>
            <td className="px-4 py-3">
                <Chip variant={getMemberRowStatusVariant(status)}>
                    {getMemberRowStatusLabel(status)}
                </Chip>
            </td>
            <td className="px-4 py-3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            disabled={busy}
                            className="border-sarge-gray-200 bg-sarge-gray-0 text-sarge-gray-800 hover:bg-sarge-gray-50 data-[state=open]:bg-sarge-gray-50 focus:bg-sarge-gray-50 focus:ring-sarge-primary-500 flex h-11 w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors focus:ring-2 focus:outline-none focus:ring-inset disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <span className="truncate font-normal">
                                {getRoleLabel(currentRole)}
                            </span>
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
                                    <DropdownMenuRadioItem key={r} value={r} disabled={busy}>
                                        {getRoleLabel(r)}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                inset
                                variant="destructive"
                                disabled={busy}
                                onSelect={() => handleRemoveInvitation()}
                            >
                                Remove
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                inset
                                disabled={busy}
                                onSelect={() => handleResendInvite()}
                            >
                                Resend invite
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </td>
        </tr>
    );
}
