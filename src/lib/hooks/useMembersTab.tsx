'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import type { ColumnDef } from '@tanstack/react-table';
import { Chip } from '@/lib/components/ui/Chip';
import MemberRoleCell from '@/lib/components/settings/MemberRoleCell';
import InvitationRoleCell from '@/lib/components/settings/InvitationRoleCell';
import { useAuth } from '@/lib/auth/auth-context';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useOrgMembersAndInvites } from '@/lib/hooks/useOrgMembersAndInvites';
import { canInviteMembers } from '@/lib/utils/roles.utils';
import {
    getInvitationStatus,
    getMemberRowStatusLabel,
    getMemberRowStatusVariant,
} from '@/lib/utils/invitation.utils';
import { formatShortMonthDayYear } from '@/lib/utils/date.utils';
import type { MemberTableRow } from '@/lib/types/invitation.types';

export default function useMembersTab() {
    const { activeOrganization, activeMember } = useAuth();
    const orgId = activeOrganization?.id;
    const role = activeMember?.role;

    const { members, invitations, memberCount, isLoading, refresh } =
        useOrgMembersAndInvites(orgId);

    const [searchQuery, setSearchQuery] = useState('');
    const [inviteOpen, setInviteOpen] = useState(false);

    const searchTerm = useDebounce(searchQuery, 200).trim().toLowerCase();

    const filteredRows: MemberTableRow[] = useMemo(() => {
        const filteredMembers = !searchTerm
            ? members
            : members.filter(
                  (m) =>
                      m.user.name?.toLowerCase().includes(searchTerm) ||
                      m.user.email.toLowerCase().includes(searchTerm)
              );

        const filteredInvitations = !searchTerm
            ? invitations
            : invitations.filter((i) => i.email.toLowerCase().includes(searchTerm));

        return [
            ...filteredMembers.map((m) => ({ type: 'member' as const, data: m })),
            ...filteredInvitations.map((i) => ({ type: 'invitation' as const, data: i })),
        ];
    }, [members, invitations, searchTerm]);

    const columns: ColumnDef<MemberTableRow>[] = useMemo(() => {
        if (!orgId) return [];
        return [
            {
                id: 'user',
                header: () => 'User',
                cell: ({ row }) => {
                    if (row.original.type === 'member') {
                        const { user } = row.original.data;
                        const initial =
                            user.name?.[0]?.toUpperCase() ?? user.email[0]?.toUpperCase() ?? '?';
                        return (
                            <div className="flex items-center gap-3">
                                {user.image ? (
                                    <Image
                                        src={user.image}
                                        alt={user.name}
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
                                    <span className="text-label-s">{user.name}</span>
                                    <span className="text-label-xs text-sarge-gray-500">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        );
                    }

                    const { email } = row.original.data;
                    const initial = email[0]?.toUpperCase() ?? '?';
                    return (
                        <div className="flex items-center gap-3">
                            <div className="bg-sarge-gray-200 text-sarge-gray-600 text-label-s flex h-10 w-10 items-center justify-center rounded-full">
                                {initial}
                            </div>
                            <span className="text-label-s text-sarge-gray-500">{email}</span>
                        </div>
                    );
                },
            },
            {
                id: 'date',
                header: () => 'Join Date',
                cell: ({ row }) => (
                    <span className="text-label-s text-sarge-gray-500">
                        {formatShortMonthDayYear(row.original.data.createdAt)}
                    </span>
                ),
            },
            {
                id: 'status',
                header: () => 'Status',
                cell: ({ row }) => {
                    const status =
                        row.original.type === 'member'
                            ? 'active'
                            : getInvitationStatus(row.original.data);
                    return (
                        <Chip className="text-label-s" variant={getMemberRowStatusVariant(status)}>
                            {getMemberRowStatusLabel(status)}
                        </Chip>
                    );
                },
            },
            {
                id: 'role',
                header: () => 'Role',
                cell: ({ row }) =>
                    row.original.type === 'member' ? (
                        <MemberRoleCell
                            member={row.original.data}
                            organizationId={orgId}
                            onChanged={refresh}
                        />
                    ) : (
                        <InvitationRoleCell
                            invitation={row.original.data}
                            organizationId={orgId}
                            onChanged={refresh}
                        />
                    ),
            },
        ];
    }, [orgId, refresh]);

    const canInvite = Boolean(role && canInviteMembers(role));

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleInviteModalChange = (open: boolean) => {
        setInviteOpen(open);
        if (!open) refresh();
    };

    return {
        activeOrganization,
        orgId,
        role,
        memberCount,
        isLoading,
        searchQuery,
        onSearchChange,
        filteredRows,
        columns,
        canInvite,
        inviteOpen,
        setInviteOpen,
        handleInviteModalChange,
    };
}
