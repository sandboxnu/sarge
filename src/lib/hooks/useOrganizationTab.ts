'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { useOrgMembersAndInvites } from '@/lib/hooks/useOrgMembersAndInvites';
import { useOrgSettings } from '@/lib/hooks/useOrgSettings';

export default function useOrganizationTab() {
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

    const trimmedName = nameDraft.trim();
    const renameDisabled =
        trimmedName === '' || trimmedName === (activeOrganization?.name ?? '') || isMutating;

    const handleRename = async () => {
        if (renameDisabled) return;
        const ok = await renameOrg(trimmedName);
        if (ok) router.refresh();
    };

    const redirectToDashboard = () => {
        router.push('/crm/dashboard');
        router.refresh();
    };

    const handleLogoUpdated = () => {
        router.refresh();
    };

    const eligibleTransferMembers =
        isOwner && activeMember ? members.filter((m) => m.id !== activeMember.id) : [];

    return {
        activeOrganization,
        activeMember,
        isOwner,
        isMutating,
        nameDraft,
        setNameDraft,
        renameDisabled,
        handleRename,
        updateLogo,
        handleLogoUpdated,
        transferOpen,
        setTransferOpen,
        deleteOpen,
        setDeleteOpen,
        eligibleTransferMembers,
        transferOwnership,
        deleteOrg,
        redirectToDashboard,
    };
}
