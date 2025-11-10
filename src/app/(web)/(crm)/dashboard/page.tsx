'use client';

import { useAuth } from '@/lib/auth/auth-client';
import WelcomeModal from '@/lib/components/modal/WelcomeModal';
import CreateOrganizationModal from '@/lib/components/modal/CreateOrganizationModal';
import useSignInFlow from '@/lib/hooks/useSignInFlow';

export default function DashboardPage() {
    const auth = useAuth();
    const {
        step, open, onOpenChange, goTo,
        organizationName, setOrganizationName,
        organizationCode, setOrganizationCode,
        handleFileChange, preview, fileInputRef, handleProfileImageClick,
        submitOrganization, submitted, error, loading,
    } = useSignInFlow();

    const onboarding = auth.user?.orgId === null || auth.user?.orgId === undefined;

    if (auth.isPending) return <div>Loading...</div>;
    if (!auth.user) return <div>Not signed in</div>;

    return (
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
                    await submitOrganization();
                    goTo(null);
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
    )
}
