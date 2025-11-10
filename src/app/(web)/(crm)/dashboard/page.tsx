'use client';

import { useAuth } from '@/lib/auth/auth-client';
import WelcomeModal from '@/lib/components/modal/WelcomeModal';
import CreateOrganizationModal from '@/lib/components/modal/CreateOrganizationModal';
import useSignInFlow from '@/lib/hooks/useSignInFlow';

export default function DashboardPage() {
    const auth = useAuth();
    const {
        step,
        open,
        onOpenChange,
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

    if (auth.isPending) return <div>Loading...</div>;
    if (!auth.user) return <div>Not signed in</div>;

    const onboarding = auth.user.orgId == null;

    return (
        <div>
            {onboarding && (
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
                        onSubmit={async () => {
                            const orgId = await submitOrganization();
                            if (orgId && auth.user) auth.user.orgId = orgId;
                            if (!error && !loading) goTo(null);
                        }}
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

            {!onboarding && (
                <div>
                    This is the normal dashboard content! You are apart of an organization! Its ID
                    is {auth.user.orgId}
                </div>
            )}
        </div>
    );
}
