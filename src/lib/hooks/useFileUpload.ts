import { type UploadType } from '@/lib/connectors/s3.connector';
import { useAuth } from '@/lib/auth/auth-context';
import { useState } from 'react';

function useFileUpload(type: UploadType) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { userId } = useAuth();

    async function uploadFile(file: File, organizationId: string) {
        setError(null);
        setSubmitted(false);
        setImageUrl(null);

        if (!userId) {
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
                    userId,
                    organizationId,
                }),
            });

            const signResponseJson = await signResponse.json();

            if (!signResponse.ok) {
                setError(signResponseJson.message);
                setLoading(false);
                return;
            }

            const { data } = signResponseJson;

            const s3Response = await fetch(data.signedURL, {
                method: 'PUT',
                headers: { 'Content-Type': data.mime },
                body: file,
            });

            if (!s3Response.ok) {
                setError(`S3 upload failed with status ${s3Response.status}`);
                setLoading(false);
                return;
            }

            const confirmResponse = await fetch('/api/upload/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    key: data.key,
                    userId,
                    organizationId,
                }),
            });

            const confirmResponseJson = await confirmResponse.json();

            if (!confirmResponse.ok) {
                setError(confirmResponseJson.message);
                setLoading(false);
                return;
            }

            const { data: confirmData } = confirmResponseJson;

            setImageUrl(confirmData.imageUrl);
            return confirmData.imageUrl;
        } catch (error) {
            setError(`Error handling file change: ${error}`);
        } finally {
            setLoading(false);
            setSubmitted(true);
        }
    }

    return {
        uploadFile,
        loading,
        error,
        submitted,
        imageUrl,
    };
}

export default useFileUpload;
