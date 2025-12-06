import useOnboardingState from '@/lib/hooks/useOnboardingState';
import useFileClient from '@/lib/hooks/useFileClient';
import useOrganizationCreation from '@/lib/hooks/useOrganizationCreation';

function useOnboardingModal() {
    const { userId, step, open, goTo, onOpenChange, isOnboarding, isSignedOut, isUserLoading } =
        useOnboardingState();

    const org = useOrganizationCreation(userId);

    const { file, preview, fileInputRef, handleFileChange, handleProfileImageClick } =
        useFileClient();

    const createOrganization = () => org.createOrganization(file);

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

        preview,
        fileInputRef,
        handleFileChange,
        handleProfileImageClick,
    };
}

export default useOnboardingModal;
