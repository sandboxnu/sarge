import { useCallback } from 'react';
import { authClient } from '@/lib/auth/auth-client';
import useOnboardingState from '@/lib/hooks/useOnboardingState';
import useOrganizationCreation from '@/lib/hooks/useOrganizationCreation';

function useOnboardingModal() {
    const { userId, step, open, goTo, onOpenChange, isOnboarding, isSignedOut, isUserLoading } =
        useOnboardingState();

    const {
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
    } = useOrganizationCreation(userId);

    const onCreateSubmit = useCallback(async () => {
        const orgId = await submitOrganization();
        if (!orgId) return;

        await authClient.organization.setActive({ organizationId: orgId });
        goTo(null);
    }, [submitOrganization, goTo]);

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
        onCreateSubmit,
        organizationName,
        setOrganizationName,
        organizationCode,
        setOrganizationCode,
        preview,
        fileInputRef,
        handleFileChange,
        handleProfileImageClick,
        error,
        loading,
    };
}

export default useOnboardingModal;
