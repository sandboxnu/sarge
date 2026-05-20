'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/lib/components/ui/Button';
import { DataTable } from '@/lib/components/ui/DataTable';
import { Search } from '@/lib/components/core/Search';
import InviteUsersModal from '@/lib/components/modal/InviteUsersModal';
import useMembersTab from '@/lib/hooks/useMembersTab';

export default function MembersTab() {
    const {
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
    } = useMembersTab();

    if (!orgId) return null;

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
                        onChange={onSearchChange}
                    />
                </div>
                {canInvite && (
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
                        data={filteredRows}
                        headerClassName="bg-sarge-gray-50"
                    />
                </div>
            )}

            {activeOrganization && role && (
                <InviteUsersModal
                    open={inviteOpen}
                    onOpenChange={handleInviteModalChange}
                    organization={activeOrganization}
                    currentUserRole={role}
                />
            )}
        </div>
    );
}
