import { type UploadType } from "@/lib/services/s3.service";
import { useAuth } from '@/lib/auth/auth-client';
import { useState } from "react";

function useFileUpload(type: UploadType, organizationId?: string) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false)
    const auth = useAuth();

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) return

        if (!auth.user.id) {
            setError('User not authenticated');
            return;
        }
        if (type === 'organization' && !organizationId) {
            setError('Organization ID is required for organization uploads');
            return;
        }


        const mime = file.type

        try {
            setLoading(true)

            console.log("Body: ", {
                type,
                mime,
                userId: auth.user.id,
                organizationId
            })

            const signResponse = await fetch('/api/upload/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    mime,
                    userId: auth.user.id,
                    organizationId,
                }),
            });

            if (!signResponse.ok) {
                setError(await signResponse.text());
                setLoading(false)
                return;
            }

            const { data } = await signResponse.json();

            const s3Response = await fetch(data.signedURL, {
                method: 'PUT',
                headers: { 'Content-Type': data.mime },
                body: file
            });

            if (!s3Response.ok) {
                setError(await s3Response.text());
                setLoading(false)
                return;
            }

        } catch (error) {
            setError(`Error handling file change: ${error}`)
        } finally {
            setLoading(false)
        }
    }

    return {
        handleFileChange,
        loading,
        error
    }
}

export default useFileUpload
