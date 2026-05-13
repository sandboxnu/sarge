'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/lib/components/ui/Button';
import { Chip } from '@/lib/components/ui/Chip';
import { DataTable } from '@/lib/components/ui/DataTable';
import { Search } from '@/lib/components/core/Search';
import InviteUsersModal from '@/lib/components/modal/InviteUsersModal';
import MemberRoleCell from '@/lib/components/settings/MemberRoleCell';
import InvitationRoleCell from '@/lib/components/settings/InvitationRoleCell';
import { useAuth } from '@/lib/auth/auth-context';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useOrgMembersAndInvites } from '@/lib/hooks/useOrgMembersAndInvites';
import { canInviteMembers } from '@/lib/utils/roles.utils';
import { getInvitationStatus, getMemberRowStatusLabel, getMemberRowStatusVariant } from '@/lib/utils/invitation.utils';
import { formatShortMonthDayYear } from '@/lib/utils/date.utils';
import type { MemberTableRow } from '@/lib/types/invitation.types';

export default function MembersTab() {
    const { activeOrganization, activeMember } = useAuth();
    const orgId = activeOrganization?.id;
    const role = activeMember?.role;

    const { members, invitations, memberCount, isLoading, refresh } =
        useOrgMembersAndInvites(orgId);

    const [searchQuery, setSearchQuery] = useState('');
    const [inviteOpen, setInviteOpen] = useState(false);

    const searchTerm = useDebounce(searchQuery, 200).trim().toLowerCase();

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

    if (!orgId) return null;

    const rows: MemberTableRow[] = [
        ...filteredMembers.map((m) => ({ type: 'member' as const, data: m })),
        ...filteredInvitations.map((i) => ({ type: 'invitation' as const, data: i })),
    ];

    const columns: ColumnDef<MemberTableRow>[] = [
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

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-display-xs">Organization Members</h2>
                <p className="text-label-xs text-sarge-gray-500">
                    {memberCount} {memberCount === 1 ? 'member' : 'members'}
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <Search
                        placeholder="Type to search for a user"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                {role && canInviteMembers(role) && (
                    <Button
                        variant="primary"
                        onClick={() => setInviteOpen(true)}
                        className="h-11 shrink-0 px-4"
                    >
                        <Plus />
                        Invite users
                    </Button>
                )}
            </div>

            {isLoading ? (
                <div className="text-body-m text-sarge-gray-600 py-8 text-center">Loading...</div>
            ) : (
                <div className="border-sarge-gray-200 overflow-hidden rounded-lg border">
                    <DataTable
                        columns={columns}
                        data={rows}
                        headerClassName="bg-sarge-gray-50"
                    />
                </div>
            )}

            {activeOrganization && role && (
                <InviteUsersModal
                    open={inviteOpen}
                    onOpenChange={(open) => {
                        setInviteOpen(open);
                        if (!open) refresh();
                    }}
                    organization={activeOrganization}
                    currentUserRole={role}
                />
            )}
        </div>
    );
}
