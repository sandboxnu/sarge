'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/lib/components/ui/Button';
import { Search } from '@/lib/components/core/Search';
import InviteUsersModal from '@/lib/components/modal/InviteUsersModal';
import { useAuth } from '@/lib/auth/auth-context';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { canInviteMembers } from '@/lib/utils/roles.utils';
import { useOrgMembersAndInvites } from '@/lib/hooks/useOrgMembersAndInvites';
import ActiveMemberRow from '@/lib/components/settings/ActiveMemberRow';
import InvitationRow from '@/lib/components/settings/InvitationRow';

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

    const isEmpty = filteredMembers.length === 0 && filteredInvitations.length === 0;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-display-xs">Organization Members</h2>
                <p className="text-label-s text-sarge-gray-600">
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
                    <table className="w-full">
                        <thead className="bg-sarge-gray-50">
                            <tr>
                                <th className="text-label-s text-sarge-gray-700 px-4 py-3 text-left">
                                    User
                                </th>
                                <th className="text-label-s text-sarge-gray-700 px-4 py-3 text-left">
                                    Join Date
                                </th>
                                <th className="text-label-s text-sarge-gray-700 px-4 py-3 text-left">
                                    Status
                                </th>
                                <th className="text-label-s text-sarge-gray-700 px-4 py-3 text-left">
                                    Role
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isEmpty ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="text-body-m text-sarge-gray-600 px-4 py-8 text-center"
                                    >
                                        No members found
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {filteredMembers.map((m) => (
                                        <ActiveMemberRow
                                            key={m.id}
                                            member={m}
                                            organizationId={orgId}
                                            onRoleChanged={refresh}
                                        />
                                    ))}
                                    {filteredInvitations.map((i) => (
                                        <InvitationRow
                                            key={i.id}
                                            invitation={i}
                                            organizationId={orgId}
                                            onRoleChanged={refresh}
                                        />
                                    ))}
                                </>
                            )}
                        </tbody>
                    </table>
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
