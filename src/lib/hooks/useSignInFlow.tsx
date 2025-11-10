import { useRef, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/auth-client';

type Step = 'welcome' | 'create' | 'join' | null;

function useSignInFlow() {
    const [organizationName, setOrganizationName] = useState<string>('');
    const [organizationCode, setOrganizationCode] = useState<string>('');

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [file, setFile] = useState<File | null>(null);

    const [preview, setPreview] = useState<string>('');
    const fileInputRef = useRef<null | HTMLInputElement>(null);
    const auth = useAuth();

    const onboarding = auth.user?.orgId == null;
    const [step, setStep] = useState<Step>(onboarding ? 'welcome' : null);
    const open = step !== null;

    const onOpenChange = useCallback((o: boolean) => {
        if (!o) {
            setStep(null);
        }
    }, []);

    const goToStep = useCallback((next: Step) => {
        setStep(null);
        requestAnimationFrame(() => setStep(next));
    }, []);

    useEffect(() => {
        if (onboarding && step === null) setStep('welcome');
        if (!onboarding && step !== null) setStep(null);
    }, [onboarding, step]);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleProfileImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (preview) URL.revokeObjectURL(preview);

        const file = e.target.files?.[0];

        if (!file) return;

        const url = URL.createObjectURL(file);

        setFile(file);
        setPreview(url);
    };

    const submitOrganization = async () => {
        try {
            if (!auth.user?.id) {
                setError('User not authenticated');
                return;
            }

            setLoading(true);

            const createResponse = await fetch('/api/organizations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: organizationName,
                    createdById: auth.user.id,
                }),
            });

            if (!createResponse.ok) {
                setError('Failed to create organization. Please contact the Sarge team.');
                setLoading(false);
                return;
            }

            const createOrganizationBody = await createResponse.json();
            const organizationId = createOrganizationBody.data.id;

            const signResponse = await fetch('/api/upload/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'organization',
                    mime: file?.type,
                    userId: auth.user.id,
                    organizationId,
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
                    organizationId,
                }),
            });

            if (!confirmResponse.ok) {
                setError('Failed to upload image. Please contact the Sarge team.');
                setLoading(false);
                return;
            }

            const { data: confirmData } = await confirmResponse.json();

            const updateResponse = await fetch(`/api/organizations/${organizationId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: organizationName,
                    imageUrl: confirmData.imageUrl,
                }),
            });

            if (!updateResponse.ok) {
                setError('Failed to update organization. Please contact the Sarge team.');
                setLoading(false);
                return;
            }

            return organizationId;
        } catch (error) {
            setError(`Error creating organization: ${error} `);
        } finally {
            setLoading(false);
        }
    };

    return {
        step,
        setStep,
        open,
        onOpenChange,
        goTo: goToStep,
        toWelcome: () => goToStep('welcome'),
        toCreate: () => goToStep('create'),
        toJoin: () => goToStep('join'),
        close: () => goToStep(null),
        organizationName,
        setOrganizationName,
        organizationCode,
        setOrganizationCode,
        handleFileChange,
        preview,
        fileInputRef,
        handleProfileImageClick,
        submitOrganization,
        error,
        loading,
    };
}

export default useSignInFlow;
