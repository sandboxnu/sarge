import { useState } from 'react';
import useFileUpload from '@/lib/hooks/useFileUpload';
import { authClient } from '@/lib/auth/auth-client';
import {
    createOrganization as createOrganizationApi,
    updateOrganization,
} from '@/lib/api/organizations';
import { toast } from 'sonner';

function useOrganizationCreation(userId: string | null) {
    const [organizationName, setOrganizationName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        uploadFile,
        error: uploadError,
        loading: uploadLoading,
    } = useFileUpload('organization');

    const createOrganization = async (file?: File | null) => {
        setError(null);

        if (!userId) {
            setError('User not authenticated');
            return;
        }

        if (!organizationName.trim()) {
            setError('Organization must have a name');
            return;
        }

        try {
            setLoading(true);

            const organization = await createOrganizationApi({
                name: organizationName,
                createdById: userId,
            });

            const organizationId = organization.id;

            if (file) {
                const imageUrl = await uploadFile(file, organizationId);

                if (uploadError) {
                    setError(uploadError);
                    return;
                }

                if (imageUrl) {
                    await updateOrganization(organizationId, {
                        name: organizationName,
                        logo: imageUrl,
                    });
                }
            }

            await authClient.organization.setActive({ organizationId });
            toast.success('Organization created successfully');

            return organizationId;
        } catch (err) {
            setError((err as Error).message);
            return;
        } finally {
            setLoading(false);
        }
    };

    return {
        organizationName,
        setOrganizationName,
        error: error ?? uploadError,
        loading: loading || uploadLoading,
        createOrganization,
    };
}

export default useOrganizationCreation;
