'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TransferOwnershipModal from '@/lib/components/modal/TransferOwnershipModal';
import DeleteOrganizationModal from '@/lib/components/modal/DeleteOrganizationModal';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';
import { useAuth } from '@/lib/auth/auth-context';
import { useOrgMembersAndInvites } from '@/lib/hooks/useOrgMembersAndInvites';
import { useOrgSettings } from '@/lib/hooks/useOrgSettings';
import OrgLogoUploader from '@/lib/components/settings/OrgLogoUploader';

export default function OrganizationTab() {
    const router = useRouter();
    const { activeOrganization, activeMember } = useAuth();
    const orgId = activeOrganization?.id;
    const isOwner = activeMember?.role === 'owner';

    const { members } = useOrgMembersAndInvites(orgId);
    const { renameOrg, updateLogo, isMutating, transferOwnership, deleteOrg } =
        useOrgSettings(orgId);

    const [nameDraft, setNameDraft] = useState(activeOrganization?.name ?? '');
    const [transferOpen, setTransferOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    useEffect(() => {
        setNameDraft(activeOrganization?.name ?? '');
    }, [activeOrganization?.name]);

    if (!activeOrganization) return null;

    const trimmedName = nameDraft.trim();
    const renameDisabled =
        trimmedName === '' || trimmedName === activeOrganization.name || isMutating;

    const handleRename = async () => {
        if (renameDisabled) return;
        const ok = await renameOrg(trimmedName);
        if (ok) router.refresh();
    };

    const redirectToDashboard = () => {
        router.push('/crm/dashboard');
        router.refresh();
    };

    const eligibleTransferMembers =
        isOwner && activeMember ? members.filter((m) => m.id !== activeMember.id) : [];

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-display-xs">Organization Settings</h2>

            <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-4">
                <OrgLogoUploader
                    organization={{
                        id: activeOrganization.id,
                        name: activeOrganization.name,
                        logo: activeOrganization.logo ?? null,
                    }}
                    updateLogo={updateLogo}
                    disabled={isMutating}
                    onUpdated={() => router.refresh()}
                />

                <div className="col-start-2 flex min-w-0 flex-col gap-2">
                    <label className="text-label-m" htmlFor="org-name-input">
                        Organization name
                    </label>
                    <div className="flex min-w-0 items-center gap-3">
                        <Input
                            id="org-name-input"
                            value={nameDraft}
                            onChange={(e) => setNameDraft(e.target.value)}
                            className="h-11 min-w-0 flex-1"
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleRename}
                            disabled={renameDisabled}
                            className="h-11 shrink-0 px-4"
                        >
                            Rename
                        </Button>
                    </div>
                </div>
                <p className="text-label-xs text-sarge-gray-600 col-span-2 min-w-0 break-all">
                    Organization ID: {activeOrganization.id}
                </p>
            </div>

            {isOwner && activeMember && (
                <div className="border-sarge-gray-200 flex flex-col gap-3 border-t pt-6">
                    <h3 className="text-display-xs">Danger Zone</h3>

                    <div className="bg-sarge-gray-0 border-sarge-error-200 flex flex-col rounded-lg border">
                        <div className="flex items-center justify-between gap-4 p-6">
                            <div className="flex flex-col gap-1">
                                <h4 className="text-label-m font-semibold">Transfer ownership</h4>
                                <p className="text-body-s text-sarge-gray-600">
                                    Transfer ownership of this organization to another member.
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setTransferOpen(true)}
                                className="h-9 shrink-0 px-4"
                                disabled={eligibleTransferMembers.length === 0}
                            >
                                Transfer ownership
                            </Button>
                        </div>

                        <div className="border-sarge-gray-200 border-t" />

                        <div className="flex items-center justify-between gap-4 p-6">
                            <div className="flex flex-col gap-1">
                                <h4 className="text-label-m font-semibold">Delete Organization</h4>
                                <p className="text-body-s text-sarge-gray-600">
                                    Permanently delete this organization and all of its data. This
                                    cannot be undone.
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => setDeleteOpen(true)}
                                className="h-9 shrink-0 px-4"
                            >
                                Delete Organization
                            </Button>
                        </div>
                    </div>

                    <TransferOwnershipModal
                        open={transferOpen}
                        onOpenChange={setTransferOpen}
                        eligibleMembers={eligibleTransferMembers}
                        onConfirm={transferOwnership}
                        onSuccess={redirectToDashboard}
                    />
                    <DeleteOrganizationModal
                        open={deleteOpen}
                        onOpenChange={setDeleteOpen}
                        organization={{
                            id: activeOrganization.id,
                            name: activeOrganization.name,
                        }}
                        onConfirm={deleteOrg}
                        onSuccess={redirectToDashboard}
                    />
                </div>
            )}
        </div>
    );
}
