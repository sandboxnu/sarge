import { useState } from 'react';
import useFileUpload from '@/lib/hooks/useFileUpload';
import { authClient } from '@/lib/auth/auth-client';
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

    const invalidate = (msg: string) => {
        setError(msg);
        toast.error(msg);
        return;
    };

    const createOrganization = async (file?: File | null) => {
        setError(null);

        if (!userId) {
            invalidate('User not authenticated');
            return;
        }

        if (!organizationName.trim()) {
            invalidate('Organization must have a name');
            return;
        }

        try {
            setLoading(true);

            const createResponse = await fetch('/api/organizations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: organizationName,
                    createdById: userId,
                }),
            });

            const createJson = await createResponse.json();

            if (!createResponse.ok) {
                console.error(createJson);
                invalidate(createJson.message);
                return;
            }

            const organizationId = createJson.data.id;

            if (file) {
                const imageUrl = await uploadFile(file, organizationId);

                if (uploadError) {
                    invalidate(uploadError);
                    return;
                }

                if (imageUrl) {
                    await fetch(`/api/organizations/${organizationId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: organizationName,
                            logo: imageUrl,
                        }),
                    });
                }
            }

            await authClient.organization.setActive({ organizationId });
            toast.success('Organization created successfully');

            return organizationId;
        } catch (err) {
            console.error('Error creating organization', err);
            invalidate('Error creating organization. Please try again.');
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
