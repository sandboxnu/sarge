'use client';

import { useAuth } from '@/lib/auth/auth-context';
import AdminOnboardingButton from '@/lib/components/core/AdminOnboardingButton';
import { DashboardOverview } from '@/lib/components/dashboard/DashboardOverview';
import OnboardingModal from '@/lib/components/modal/OnboardingModal';
import useOnboardingState from '@/lib/hooks/useOnboardingState';

export default function DashboardPage() {
    const { isOnboarding, isSignedOut, isUserLoading } = useOnboardingState();
    const { isSuperUser } = useAuth();

    if (isUserLoading) return <div>Loading...</div>;
    if (isSignedOut) return <div>You must be signed in...</div>;

    return (
        <div className="h-full">
            {isOnboarding ? (
                <>
                    <OnboardingModal />
                    {isSuperUser && <AdminOnboardingButton />}
                </>
            ) : (
                <DashboardOverview />
            )}
        </div>
    );
}
