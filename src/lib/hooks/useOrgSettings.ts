'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth/auth-client';
import { transferOwnership as transferOwnershipApi } from '@/lib/api/organizations';

export type UseOrgSettingsResult = {
    renameOrg: (newName: string) => Promise<boolean>;
    updateLogo: (logoUrl: string) => Promise<boolean>;
    deleteOrg: () => Promise<boolean>;
    transferOwnership: (targetMemberId: string) => Promise<boolean>;
    isMutating: boolean;
};

export function useOrgSettings(organizationId: string | undefined): UseOrgSettingsResult {
    const [isMutating, setIsMutating] = useState(false);

    const renameOrg = async (newName: string): Promise<boolean> => {
        if (!organizationId) {
            toast.error('No active organization');
            return false;
        }
        const trimmed = newName.trim();
        if (!trimmed) {
            toast.error('Organization name cannot be empty');
            return false;
        }
        try {
            setIsMutating(true);
            await authClient.organization.update({
                data: { name: trimmed },
                organizationId,
            });
            toast.success('Organization renamed');
            return true;
        } catch (err) {
            toast.error(
                `Failed to rename organization: ${err instanceof Error ? err.message : 'Unknown error'}`
            );
            return false;
        } finally {
            setIsMutating(false);
        }
    };

    const updateLogo = async (logoUrl: string): Promise<boolean> => {
        if (!organizationId) {
            toast.error('No active organization');
            return false;
        }
        try {
            setIsMutating(true);
            await authClient.organization.update({
                data: { logo: logoUrl },
                organizationId,
            });
            toast.success('Logo updated');
            return true;
        } catch (err) {
            toast.error(
                `Failed to update logo: ${err instanceof Error ? err.message : 'Unknown error'}`
            );
            return false;
        } finally {
            setIsMutating(false);
        }
    };

    const deleteOrg = async (): Promise<boolean> => {
        if (!organizationId) {
            toast.error('No active organization');
            return false;
        }
        try {
            setIsMutating(true);
            await authClient.organization.delete({ organizationId });
            toast.success('Organization deleted');
            return true;
        } catch (err) {
            toast.error(
                `Failed to delete organization: ${err instanceof Error ? err.message : 'Unknown error'}`
            );
            return false;
        } finally {
            setIsMutating(false);
        }
    };

    const transferOwnership = async (targetMemberId: string): Promise<boolean> => {
        if (!organizationId) {
            toast.error('No active organization');
            return false;
        }
        try {
            setIsMutating(true);
            await transferOwnershipApi(organizationId, targetMemberId);
            toast.success('Ownership transferred');
            return true;
        } catch (err) {
            toast.error(
                `Failed to transfer ownership: ${err instanceof Error ? err.message : 'Unknown error'}`
            );
            return false;
        } finally {
            setIsMutating(false);
        }
    };

    return {
        renameOrg,
        updateLogo,
        deleteOrg,
        transferOwnership,
        isMutating,
    };
}
