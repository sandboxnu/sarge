'use client';

import WelcomeModal from '@/lib/components/modal/WelcomeModal';
import CreateOrganizationModal from '@/lib/components/modal/CreateOrganizationModal';
import useDashboard from '@/lib/hooks/useDashboard';

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
    if (isSignedOut) return <div>You must be signed in...</div>

    return (
        <div>
            {isOnboarding && (
                <div>
                    <WelcomeModal
                        open={open && step === 'welcome'}
                        onOpenChange={onOpenChange}
                        onCreate={() => goTo('create')}
                        onJoin={() => goTo('join')}
                    />

                    <CreateOrganizationModal
                        open={open && step === 'create'}
                        onOpenChange={onOpenChange}
                        onBack={() => goTo('welcome')}
                        onSubmit={onCreateSubmit}
                        setOrganizationName={setOrganizationName}
                        organizationName={organizationName}
                        preview={preview}
                        fileInputRef={fileInputRef}
                        handleFileChange={handleFileChange}
                        handleProfileImageClick={handleProfileImageClick}
                        loading={loading}
                        error={error}
                    />
                </div>
            )}

            {!isOnboarding && (
                <div>
                    This is the normal dashboard content!
                </div>
            )}
        </div>
    );
}
