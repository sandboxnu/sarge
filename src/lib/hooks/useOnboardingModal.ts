import useOnboardingState from '@/lib/hooks/useOnboardingState';
import useFileClient from '@/lib/hooks/useFileClient';
import useOrganizationCreation from '@/lib/hooks/useOrganizationCreation';

function useOnboardingModal() {
    const { userId, step, open, goTo, onOpenChange, isOnboarding, isSignedOut, isUserLoading } =
        useOnboardingState();

    const { organizationName, setOrganizationName, error, loading, createOrganization } =
        useOrganizationCreation(userId);

    const { preview, fileInputRef, handleFileChange, handleProfileImageClick } = useFileClient();

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
        organizationName,
        setOrganizationName,
        error,
        loading,

        preview,
        fileInputRef,
        handleFileChange,
        handleProfileImageClick,
    };
}

export default useOnboardingModal;
