'use client';

import OnboardingModal from '@/lib/components/modal/OnboardingModal';
import useOnboardingState from '@/lib/hooks/useOnboardingState';
import Image from 'next/image';

export default function DashboardPage() {
    const { isOnboarding, isSignedOut, isUserLoading } = useOnboardingState();

    if (isUserLoading) return <div>Loading...</div>;
    if (isSignedOut) return <div>You must be signed in...</div>;

    return (
        <div>
            {isOnboarding ? (
                <OnboardingModal />
            ) : (
                <div className="flex items-center justify-center h-screen flex-col">
                    <Image
                        src="/HelmetLogoFull.png"
                        alt="Helmet Logo"
                        width={900}
                        height={900}
                        priority
                    />
                    <p className="text-xl text-sarge-primary-700">Coming 2026...</p>
                </div>
            )}
        </div>
    );
}
