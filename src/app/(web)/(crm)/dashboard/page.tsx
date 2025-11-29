'use client';

import OnboardingModal from '@/lib/components/modal/OnboardingModal';
import useOnboardingState from '@/lib/hooks/useOnboardingState';

export default function DashboardPage() {
    const { isOnboarding, isSignedOut, isUserLoading } = useOnboardingState();

    if (isUserLoading) return <div>Loading...</div>;
    if (isSignedOut) return <div>You must be signed in...</div>;

    return (
        <div>
            {isOnboarding ? (
                <OnboardingModal />
            ) : (
                <div>
                    <p>This is the normal dashboard content!</p>
                </div>
            )}
        </div>
    );
}
