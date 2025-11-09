import { type UploadType } from '@/lib/connectors/s3.connector';
import { useSession } from '@/lib/auth/auth-client';
import { useState } from 'react';

function useFileUpload(type: UploadType, organizationId?: string) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { data: session } = useSession();

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) return;

        setError(null);
        setSubmitted(false);
        setImageUrl(null);

        if (!session?.user?.id) {
            setError('User not authenticated');
            return;
        }

        if (type === 'organization' && !organizationId) {
            setError('Organization ID is required for organization uploads');
            return;
        }

        const mime = file.type;

        try {
            setLoading(true);

            const signResponse = await fetch('/api/upload/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    mime,
                    userId: session.user.id,
                    organizationId,
                }),
            });

            if (!signResponse.ok) {
                setError('[GET SIGNURL] Failed to upload image. Please contact the Sarge team.');
                setLoading(false);
                return;
            }

            const { data } = await signResponse.json();

            const s3Response = await fetch(data.signedURL, {
                method: 'PUT',
                headers: { 'Content-Type': data.mime },
                body: file,
            });

            if (!s3Response.ok) {
                setError('[PUT TO S3] Failed to upload image. Please contact the Sarge team.');
                setLoading(false);
                return;
            }

            const confirmResponse = await fetch('/api/upload/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    key: data.key,
                    userId: session.user.id,
                    organizationId,
                }),
            });

            if (!confirmResponse.ok) {
                setError('[CONFIRM URL] Failed to upload image. Please contact the Sarge team.');
                setLoading(false);
                return;
            }

            const { data: confirmData } = await confirmResponse.json();

            setImageUrl(confirmData.imageUrl);
        } catch (error) {
            setError(`Error handling file change: ${error}`);
        } finally {
            setLoading(false);
            setSubmitted(true);
        }
    }

    return {
        handleFileChange,
        loading,
        error,
        submitted,
        imageUrl,
    };
}

export default useFileUpload;
