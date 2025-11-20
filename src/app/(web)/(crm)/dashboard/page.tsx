'use client';

import OnboardingModal from '@/lib/components/modal/OnboardingModal';
import useDashboard from '@/lib/hooks/useDashboard';
import Image from 'next/image';

export default function DashboardPage() {
    const {
        step,
        open,
        onOpenChange,
        onCreateSubmit,
        goTo,
        organizationName,
        setOrganizationName,
        handleFileChange,
        preview,
        fileInputRef,
        handleProfileImageClick,
        isOnboarding,
        isSignedOut,
        isUserLoading,
        error,
        loading,
    } = useDashboard();

    if (isUserLoading) return <div>Loading...</div>;
    if (isSignedOut) return <div>You must be signed in...</div>;

    return (
        <div>
            {isOnboarding && (
                <OnboardingModal
                    open={open}
                    onOpenChange={onOpenChange}
                    step={step}
                    goTo={goTo}
                    organizationName={organizationName}
                    setOrganizationName={setOrganizationName}
                    handleFileChange={handleFileChange}
                    preview={preview}
                    fileInputRef={fileInputRef}
                    handleProfileImageClick={handleProfileImageClick}
                    loading={loading}
                    error={error}
                    onCreateSubmit={onCreateSubmit}
                />
            )}

            {!isOnboarding && (
                <div>
                    <p>This is the normal dashboard content!</p>
                </div>
            )}
        </div>
    );
}
