import { useCallback, useState } from 'react';
import { useAvatarUpload } from '@/lib/hooks/useAvatarUpload';

export function useOrganizationCreation(userId: string | null) {
    const [organizationName, setOrganizationName] = useState<string>('');
    const [organizationCode, setOrganizationCode] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const { file, preview, fileInputRef, handleFileChange, handleProfileImageClick } =
        useAvatarUpload();

    const submitOrganization = useCallback(async () => {
        setError(null);

        if (!userId) {
            setError('User not authenticated');
            return null;
        }

        if (!organizationName.trim()) {
            setError('Organization must have a name');
            return null;
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

            if (!createResponse.ok) {
                setError('Failed to create organization. Please contact the Sarge team.');
                return null;
            }

            const createOrganizationBody = await createResponse.json();
            const organizationId = createOrganizationBody.data.id as string;

            if (!file) {
                return organizationId;
            }

            const signResponse = await fetch('/api/upload/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'organization',
                    mime: file.type,
                    userId,
                    organizationId,
                }),
            });

            if (!signResponse.ok) {
                setError('Failed to upload image. Please contact the Sarge team.');
                return null;
            }

            const { data } = await signResponse.json();

            const s3Response = await fetch(data.signedURL, {
                method: 'PUT',
                headers: { 'Content-Type': data.mime },
                body: file,
            });

            if (!s3Response.ok) {
                setError('Failed to upload image. Please contact the Sarge team.');
                return null;
            }

            const confirmResponse = await fetch('/api/upload/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'organization',
                    key: data.key,
                    userId,
                    organizationId,
                }),
            });

            if (!confirmResponse.ok) {
                setError('Failed to upload image. Please contact the Sarge team.');
                return null;
            }

            const { data: confirmData } = await confirmResponse.json();

            const updateResponse = await fetch(`/api/organizations/${organizationId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: organizationName,
                    logo: confirmData.imageUrl,
                }),
            });

            if (!updateResponse.ok) {
                setError('Failed to update organization. Please contact the Sarge team.');
                return null;
            }

            return organizationId;
        } catch (err) {
            console.error('Error creating organization', err);
            setError('Error creating organization. Please try again or contact the Sarge team.');
            return null;
        } finally {
            setLoading(false);
        }
    }, [userId, organizationName, file]);

    return {
        organizationName,
        setOrganizationName,
        organizationCode,
        setOrganizationCode,
        error,
        loading,
        submitOrganization,
        preview,
        fileInputRef,
        handleFileChange,
        handleProfileImageClick,
    };
}
