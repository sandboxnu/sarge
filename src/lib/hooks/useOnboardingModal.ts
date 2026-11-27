import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import useOnboardingState from '@/lib/hooks/useOnboardingState';
import { acceptInvitationAndActivate, resolveInvitationCode } from '@/lib/api/organizations';
import useFileClient from '@/lib/hooks/useFileClient';
import useOrganizationCreation from '@/lib/hooks/useOrganizationCreation';

function useOnboardingModal() {
    const { userId, step, open, goTo, onOpenChange, isOnboarding, isSignedOut, isUserLoading } =
        useOnboardingState();

    const org = useOrganizationCreation(userId);

    const { file, preview, fileInputRef, handleFileChange, handleProfileImageClick } =
        useFileClient();

    const createOrganization = () => org.createOrganization(file);

    const router = useRouter();
    const [joinCode, setJoinCode] = useState('');
    const [joinError, setJoinError] = useState<string | null>(null);
    const [joining, setJoining] = useState(false);

    const joinOrganization = async () => {
        setJoinError(null);
        setJoining(true);
        try {
            const { invitationId, organizationId } = await resolveInvitationCode(joinCode);
            await acceptInvitationAndActivate(invitationId, organizationId);
            toast.success('Joined organization');
            // useOnboardingState closes the modal once the active member loads
            router.refresh();
        } catch (err) {
            setJoinError((err as Error).message);
        } finally {
            setJoining(false);
        }
    };

    return {
        step,
        open,
        onOpenChange,
        goTo,
        toWelcome: () => goTo('welcome'),
        toCreate: () => goTo('create'),
        toJoin: () => goTo('join'),
        close: () => goTo(null),
        isOnboarding,
        isSignedOut,
        isUserLoading,

        createOrganization,
        organizationName: org.organizationName,
        setOrganizationName: org.setOrganizationName,
        error: org.error,
        loading: org.loading,

        joinCode,
        setJoinCode,
        joinError,
        joining,
        joinOrganization,

        preview,
        fileInputRef,
        handleFileChange,
        handleProfileImageClick,
    };
}

export default useOnboardingModal;
