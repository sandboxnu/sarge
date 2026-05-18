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
import useMemberRoleCell from '@/lib/hooks/useMemberRoleCell';
import type { MemberWithUser } from '@/lib/types/member.types';
import { getAssignableRoles, getRoleLabel } from '@/lib/utils/roles.utils';

type MemberRoleCellProps = {
    member: MemberWithUser;
    organizationId: string;
    onChanged: () => void;
};

export default function MemberRoleCell({ member, organizationId, onChanged }: MemberRoleCellProps) {
    const { updating, currentRole, isOwner, handleRoleChange, handleRemoveMember } =
        useMemberRoleCell({ member, organizationId, onChanged });

    if (isOwner) {
        return (
            <div className="border-sarge-gray-200 bg-sarge-gray-0 text-sarge-gray-800 flex h-11 cursor-not-allowed items-center rounded-lg border px-3 py-2 opacity-50">
                <span className="text-label-s truncate">{getRoleLabel('owner')}</span>
            </div>
        );
    }

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
                        variant="destructive"
                        disabled={updating}
                        onSelect={() => handleRemoveMember()}
                    >
                        Remove
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
