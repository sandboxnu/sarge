import { useRef, useState, useEffect } from "react";
import { useAuth } from '@/lib/auth/auth-client';

function useSignInFlow() {
    const [createOrganization, setCreateOrganization] = useState<boolean>(false);
    const [joinOrganization, setJoinOrganization] = useState<boolean>(false);
    const [organizationName, setOrganizationName] = useState<string>('');
    const [organizationCode, setOrganizationCode] = useState<string>('');

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);

    const [file, setFile] = useState<File | null>(null)

    const [preview, setPreview] = useState<string>('')
    const fileInputRef = useRef<null | HTMLInputElement>(null)
    const auth = useAuth();

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleProfileImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (preview) URL.revokeObjectURL(preview)

        const file = e.target.files?.[0]

        if (!file) return;

        const url = URL.createObjectURL(file);

        setFile(file)
        setPreview(url);
    }

    const submitOrganization = async () => {
        try {
            if (!auth.user?.id) {
                setError('User not authenticated');
                return;
            }

            setLoading(true)

            const createResponse = await fetch('/api/organization', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: organizationName,
                    createdById: auth.user.id
                })
            })

            if (!createResponse.ok) {
                setError('Failed to create organization. Please contact the Sarge team.');
                setLoading(false);
                return;
            }

            const createOrganizationBody = await createResponse.json()
            const organizationId = createOrganizationBody.data.id

            const signResponse = await fetch('/api/upload/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    organization: "organization",
                    mime: file?.type,
                    userId: auth.user.id,
                    organizationId
                }),
            });

            if (!signResponse.ok) {
                setError('Failed to upload image. Please contact the Sarge team.');
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
                setError('Failed to upload image. Please contact the Sarge team.');
                setLoading(false);
                return;
            }

            const confirmResponse = await fetch('/api/upload/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'organization',
                    key: data.key,
                    userId: auth.user.id,
                }),
            });

            if (!confirmResponse.ok) {
                setError('Failed to upload image. Please contact the Sarge team.');
                setLoading(false);
                return;
            }

            const { data: confirmData } = await confirmResponse.json();

            const updateResponse = await fetch(`/api/organization/${organizationId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: organizationName,
                    imageUrl: confirmData.imageUrl
                }),
            });

            if (!updateResponse.ok) {
                setError('Failed to update organization. Please contact the Sarge team.');
                setLoading(false);
                return;
            }
        } catch (error) {
            setError(`Error creating organization: ${error}`)
        } finally {
            setLoading(false);
            setSubmitted(true);
        }
    }

    return {
        createOrganization,
        setCreateOrganization,
        joinOrganization,
        setJoinOrganization,
        organizationName,
        setOrganizationName,
        organizationCode,
        setOrganizationCode,
        handleFileChange,
        preview,
        fileInputRef,
        handleProfileImageClick,
        submitOrganization,
        submitted,
        error,
        loading
    }
}

export default useSignInFlow;
