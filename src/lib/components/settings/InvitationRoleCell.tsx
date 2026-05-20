'use client';

import { ChevronDown } from 'lucide-react';
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
import useInvitationRoleCell from '@/lib/hooks/useInvitationRoleCell';
import type { OrgInvitation } from '@/lib/types/invitation.types';
import { getAssignableRoles, getRoleLabel } from '@/lib/utils/roles.utils';

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
    const { updating, currentRole, handleRoleChange, handleRemoveInvitation, handleResendInvite } =
        useInvitationRoleCell({ invitation, organizationId, onChanged });

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
