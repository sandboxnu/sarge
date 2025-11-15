'use client';

import { useActiveMember, useActiveOrganization } from '@/lib/auth/auth-client';
import { authClient } from '@/lib/auth/auth-client';
import WelcomeModal from '@/lib/components/modal/WelcomeModal';
import CreateOrganizationModal from '@/lib/components/modal/CreateOrganizationModal';
import useSignInFlow from '@/lib/hooks/useSignInFlow';
import { useAuth, useAuthMember, useAuthOrganization } from '@/lib/auth/auth-context';

export default function DashboardPage() {
    const auth = useAuth();
    const {
        step,
        open,
        onOpenChange,
        onCreateSubmit,
        goTo,
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
    } = useSignInFlow();

    const isUserLoading = auth.sessionPending;
    const isSignedOut = !auth.isAuthenticated && !auth.sessionPending;
    const isOnboarding = auth.isAuthenticated && !auth.hasActiveOrganization && !auth.isPending;

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
                    This is the normal dashboard content! You are apart of an organization! Its ID
                    is {auth.activeOrganizationId}
                </div>
            )}
        </div>
    );
}
