'use client';

import Image from 'next/image';
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
import { getAssignableRoles, getRoleLabel, type OrgRole } from '@/lib/utils/roles.utils';
import { getMemberRowStatusLabel, getMemberRowStatusVariant } from '@/lib/utils/invitation.utils';
import { formatShortMonthDayYear } from '@/lib/utils/date.utils';
import type { MemberWithUser } from '@/lib/types/member.types';

type ActiveMemberRowProps = {
    member: MemberWithUser;
    organizationId: string;
    onRoleChanged: () => void;
};

export default function ActiveMemberRow({
    member,
    organizationId,
    onRoleChanged,
}: ActiveMemberRowProps) {
    const [updating, setUpdating] = useState(false);
    const [currentRole, setCurrentRole] = useState(member.role);
    const isOwner = currentRole === 'owner';
    const initial =
        member.user.name?.[0]?.toUpperCase() ?? member.user.email[0]?.toUpperCase() ?? '?';
    const joinedLabel = formatShortMonthDayYear(member.createdAt);

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
            onRoleChanged();
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
            onRoleChanged();
        } catch {
            toast.error('Failed to remove member');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <tr className="hover:bg-sarge-gray-50 border-sarge-gray-200 border-b">
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    {member.user.image ? (
                        <Image
                            src={member.user.image}
                            alt={member.user.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    ) : (
                        <div className="bg-sarge-gray-200 text-sarge-gray-600 text-label-s flex h-10 w-10 items-center justify-center rounded-full">
                            {initial}
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className="text-label-m">{member.user.name}</span>
                        <span className="text-body-s text-sarge-gray-600">{member.user.email}</span>
                    </div>
                </div>
            </td>
            <td className="text-label-s px-4 py-3">{joinedLabel}</td>
            <td className="px-4 py-3">
                <Chip variant={getMemberRowStatusVariant('active')}>
                    {getMemberRowStatusLabel('active')}
                </Chip>
            </td>
            <td className="px-4 py-3">
                {isOwner ? (
                    <div className="border-sarge-gray-200 bg-sarge-gray-0 text-sarge-gray-800 flex h-11 cursor-not-allowed items-center rounded-lg border px-3 py-2 text-sm opacity-50">
                        <span className="truncate">{getRoleLabel('owner')}</span>
                    </div>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                disabled={updating}
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
                                        <DropdownMenuRadioItem
                                            key={r}
                                            value={r}
                                            disabled={updating}
                                        >
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
                )}
            </td>
        </tr>
    );
}
