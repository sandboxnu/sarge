import { useRef, useState, useEffect, useCallback } from 'react';
import { useActiveMember, useSession, authClient } from '@/lib/auth/auth-client';

type Step = 'welcome' | 'create' | 'join' | null;

function useSignInFlow() {
    const [organizationName, setOrganizationName] = useState<string>('');
    const [organizationCode, setOrganizationCode] = useState<string>('');

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [file, setFile] = useState<File | null>(null);

    const [preview, setPreview] = useState<string>('');
    const fileInputRef = useRef<null | HTMLInputElement>(null);

    const { data: session } = useSession();
    const member = useActiveMember();

    const userId = session?.user?.id ?? null;
    const onboarding = !member.isPending && member.data?.organizationId == null;

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
            if (!userId) {
                setError('User not authenticated');
                return;
            }

            if (organizationName === '') {
                setError('Organization must have a name')
                return;
            }

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
                setLoading(false);
                return;
            }

            const createOrganizationBody = await createResponse.json();
            const organizationId = createOrganizationBody.data.id;

            if (!file) {
                return organizationId;
            }

            const signResponse = await fetch('/api/upload/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'organization',
                    mime: file?.type,
                    userId,
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
                    userId,
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
                    logo: confirmData.imageUrl,
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

    const onCreateSubmit = async () => {
        setError(null);
        const orgId = await submitOrganization();
        if (!orgId) return;
        await authClient.organization.setActive({ organizationId: orgId });
        goToStep(null);
    };

    return {
        step,
        setStep,
        open,
        onOpenChange,
        onCreateSubmit,
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
